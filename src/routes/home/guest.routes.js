import express from "express";
import lodash from "lodash";

import { Product } from "#root/model/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { randomStringUtils } from "#utils/index.js";

const router = express.Router();

const TRANSACTION_LIMIT_TIME = 1000 * 60 * 60 * 24; // 1 day
router.get('/', ( req, res ) => {
    return res.render('home/card/guest.ejs');
});

router.get('/products', async ( req, res ) => {
    const products = req.cookies?.cart || [];

    if (products.length === 0) {
        return res.json({ products: [], total: 0 });
    }

    const ids = products.map(product => product.id);
    const quantities = products.map(product => product.quantity);

    try {
        const productsInCart = await Product.find({ _id: { $in: ids } }).select(['name', 'salePrice', 'images', 'slug']).lean();
        return res.json({ products: productsInCart, total: quantities });
    } catch (e) {
        console.log(e);
        return res.status(500).json(ErrorMessage(500, 'Internal server error'));
    }

});


router.post('/', ( req, res ) => {
//     get cookie with name 'cart'
    const products = req.cookies?.cart || [];

    const { id, quantity } = req.body;

    const product = products.find(product => product.id === id);
    if (product) {
        product.quantity = quantity;
    } else {
        products.push({ id, quantity });
    }

    res.cookie('cart', products, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    return res.json({ products, status: 200 });
})

router.delete('/', ( req, res ) => {
    const products = req.cookies?.cart || [];

    const { id } = req.body;
    if (!id) {
        return res.status(400).json(ErrorMessage(400, 'Bad request'));
    }

    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        return res.status(404).json(ErrorMessage(404, 'Not found'));
    }

    products.splice(index, 1);

    res.cookie('cart', products, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    return res.status(200).json({ products });
})

router.post('/checkout', ( req, res ) => {
    const data = req.body;

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
    let token = `${ randomStringUtils.randomString(10) }_${ Date.now() }`;
    const tokenMix = `&token=${token}`;
    url += tokenMix;

    req.session.transaction = token;
    req.session.save();
    return res.status(200).json({ redirect: `/cart/guest/checkout?${ url }` });
})

router.get('/checkout',async (req, res) => {
    const queries = req.query;

    if (lodash.isEmpty(queries)) {
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'danger');
        return res.redirect('/cart/guest');
    }


    console.log(queries)
    const token = queries.token;
    if (!token) {
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect('/cart/guest');
    }

    const transaction = req.session.transaction.split('_');
    if (!transaction) {
        console.log('Non transaction')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect('/cart/guest');
    }

    const tokenMix = token.split('_');
    if (tokenMix.length !== 2) {
        console.log('Invalid token')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect('/cart/guest');
    }

    if (tokenMix[0].trim() !== transaction[0]) {
        console.log(`tokenMix: ${tokenMix[0]} - transaction: ${transaction[0]}`)
        console.log('Invalid token')
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect('/cart/guest');
    }

    const time = parseInt(tokenMix[1]);

    const now = Date.now();

    if (now - time > TRANSACTION_LIMIT_TIME) {
        console.log('Transaction expired');
        req.flash('message', 'Please!! Select things you want to buy');
        req.flash('type', 'warning');
        return res.redirect('/cart/guest');
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

    return res.render('home/checkout/checkout-guest.ejs', { products: productsInfo, quantities: quantities });
})

export default router;