import express from "express";
import { User, Product } from "#root/model/index.js";
import { UserValidator } from "#validator/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import lodash from "lodash";
import { randomStringUtils } from "#utils/index.js";

const router = express.Router();
const TRANSACTION_LIMIT_TIME = 1000 * 60 * 60 * 24; // 1 day

router.get('/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, ( req, res ) => {
    const id = req.params.id;
    return res.render('home/card/index.ejs', { id, user: req.user, message: req.flash('message') });
})

router.post('/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, async ( req, res ) => {
    try {
        const { id, quantity } = req.body;
        console.log(id, quantity);
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: ErrorMessage(400, 'User Not Found') });
        }

        const product = user.cart.find(product => product.productId.toString() === id);
        console.log('Product')
        console.log(product);
        if (product) {
            product.quantity = quantity;
        } else {
            user.cart.push({ productId: id, quantity });
        }

        await user.save();
        return res.json({ products: user.cart, status: 200 });
    } catch (e) {
        return res.status(500).json(ErrorMessage(500, 'Internal server error'));
    }
});

router.delete('/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, async ( req, res ) => {
    const userId = req.params.id;

    const { id } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: ErrorMessage(400, 'User Not Found') });
        }

        const product = user.cart.find(product => product.productId.toString() === id);
        if (!product) {
            return res.status(404).json({ message: ErrorMessage(400, 'Product Not Found') });
        }

        const index = user?.cart && user.cart.findIndex(product => product.productId.toString() === id);
        if (index === -1 || index === undefined) {
            return res.status(404).json(ErrorMessage(404, 'Not found'));
        }

        user.cart.splice(index, 1);

        user.save();

        return res.status(200).json({ products: user.cart });


    } catch (e) {
        console.log(e);
        return res.status(500).json(ErrorMessage(500, 'Internal server error'));
    }
    // return res.json({ products: user.cart, status: 200 });

});

router.get('/products/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, async ( req, res ) => {
    const user = req.user;

    // populate product
    const cart = await Promise.all(user.cart.map(async ( product ) => {
        const productSelection = ['name', 'salePrice', 'images', 'slug'];
        const productDetail = await Product.findById(product.productId).select(productSelection);
        console.log(productDetail);
        return {
            ...productDetail._doc,
            quantity: product.quantity
        }
    }));
    return res.json({ products: cart, status: 200 });
});

function populateProduct( product ) {
    return new Promise(( resolve, reject ) => {
        Product.findById(product.productId).select(['name', 'salePrice', 'images', 'slug']).then(productDetail => {
            resolve({
                ...productDetail._doc,
                quantity: product.quantity
            })
        }).catch(err => {
            reject(err);
        })
    })
}

router.post('/checkout/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, async (req, res) => {
    const data = req.body;
    const user = req.user;
    console.log(data);

    if (!data || data.length === 0 || lodash.isEmpty(data)) {
        return res.status(400).json({
            ...ErrorMessage(400, 'Please!! Select things you want to buy'),
            redirect: '/store'
        });
    }

    // url wit foremat 'product-id=quantity'
    let url = data.map(product => `${ product.id }=${ product.quantity }`).join('&');
    console.log('url', url);
    let token = `${ user.token }`;
    const tokenMix = `&token=${token}---${ Date.now() }`;
    url += tokenMix;

    req.session.transaction = token;
    req.session.save();
    return res.status(200).json({ redirect: `/cart/checkout/${req.user._id}?${ url }` });
});

router.get('/checkout/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, async (req, res) => {
    const queries = req.query;
    const userId = req.user._id;
    if (lodash.isEmpty(queries)) {
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'danger');
        console.log('Empty queries');
        return res.redirect(`/cart/${userId}`);
    }


    console.log(queries)
    const token = queries.token;
    if (!token) {
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        console.log('Non token');
        return res.redirect(`/cart/${userId}`);
    }
    // let transaction = '';
    // try {
    //     transaction = req.session.transaction.split('---');
    // } catch (e) {
    //     transaction = [req.user.token];
    // }
    let transaction = req.user.token;
    if (!transaction) {
        console.log('Non transaction')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        console.log('Non transaction');
        return res.redirect(`/cart/${userId}`);
    }

    const tokenMix = token.split('---');
    if (tokenMix.length !== 2) {
        console.log('Invalid token')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        console.log('Invalid token length');
        return res.redirect(`/cart/${userId}`);
    }

    if (tokenMix[0].trim() !== transaction) {
        console.log(`tokenMix: ${tokenMix[0]} - transaction: ${transaction}`)
        console.log('Invalid token')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect(`/cart/${userId}`);
    }

    const time = parseInt(tokenMix[1]);

    const now = Date.now();

    if (now - time > TRANSACTION_LIMIT_TIME) {
        console.log('Transaction expired');
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect(`/cart/${userId}`);
    }

    const products = [];

    Object.keys(queries).forEach(key => {
        if (key === 'token') return;
        const quantity = parseInt(queries[key]);
        const id = key;

        products.push({ id, quantity });
    });

    const ids = products.map(product => product.id);
    const quantities = products.map(product => product.quantity);

    const productsInfo =await Product.find({ _id: { $in: ids } }).select(['name', 'salePrice', 'images', 'slug']).lean();
    console.log(productsInfo);

    return res.render('home/checkout/checkout-user.ejs', { products: productsInfo, quantities: quantities, user: req.user });
})
export default router;