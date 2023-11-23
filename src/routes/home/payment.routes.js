import express from "express";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";
import { env } from "#config/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

import {PaymentController} from "#controllers/index.js";

const router = express.Router();
let {
    VN_PAY_TMN_CODE,
    VN_PAY_URL,
    VN_PAY_HASH_SECRET,
    VN_PAY_RETURN_URL,
    VN_PAY_BANK_CODE,
    URL_PREFIX,
    PORT
} = env;
const DEFAULT_LANG = 'en';
router.post('/create-payment-intent', ( req, res ) => {
    const { amount, name, email, note, address, products} = req.body;
    let url = VN_PAY_URL;
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let orderId = '';
    if (req.isAuthenticated()) {
        orderId = `${ req.user._id }-${ moment(date).format('DDHHmmss') }`;
    } else {
        orderId = `guest-${ moment(date).format('DDHHmmss') }`;
    }
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // let orderId = moment(date).format('DDHHmmss');
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = VN_PAY_TMN_CODE;
    vnp_Params['vnp_Locale'] = DEFAULT_LANG;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = `${ URL_PREFIX }:${ PORT }${ VN_PAY_RETURN_URL }`;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // vnp_Params['vnp_BankCode'] = VN_PAY_BANK_CODE;

    vnp_Params = sortObject(vnp_Params);
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", VN_PAY_HASH_SECRET);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    url += '?' + qs.stringify(vnp_Params, { encode: false });

    //res.redirect(VN_PAY_URL);
    req.session.orderInfo = {
        orderId: orderId,
        amount: amount,
        name: name,
        email: email,
        note: note,
        address: address,
        products: products
    }

    req.session.save();
    console.log(url);
    return res.status(200).json({ url: url });
});

router.get('/vnpay-return', PaymentController.vnpReturn);

router.get('/result', ( req, res ) => {
    const flash = req.flash('result');
    console.log(flash)
    if (flash.length === 0) {
        req.flash('message', 'Payment failed');
        req.flash('type', 'danger');
        return res.render('home/checkout/payment.ejs', {
            user: req?.user || null,
            message: 'Payment failed',
            type: 'danger',
            amount: 0
        })
    } else {
        const {message , type, amount} = flash[0];
        return res.render('home/checkout/payment.ejs', {
            user: req?.user || null,
            message: message,
            type: type,
            amount: amount
        })

    }
})

function sortObject( obj ) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export default router;