import qs from "qs";
import crypto from "crypto";
import { env } from "#config/index.js";
import { PaymentService } from "#services/index.js";
let {
    VN_PAY_TMN_CODE,
    VN_PAY_URL,
    VN_PAY_HASH_SECRET,
    VN_PAY_RETURN_URL,
    VN_PAY_BANK_CODE,
    URL_PREFIX,
    PORT
} = env;
class PaymentController {
    constructor() {
        this._paymentService = new PaymentService();
    }

    vnpReturn = async ( req, res ) => {
        const user = req?.user || 'guest';
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params);

        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", VN_PAY_HASH_SECRET);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        const orderId = vnp_Params['vnp_TxnRef'];
        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            const orderInfo = req.session?.orderInfo;
            if (!orderInfo) {
                console.log("orderInfo null");
                const message = {
                    message: 'Payment failed',
                    type: 'danger'
                }

                req.flash('flash', message);
                if (req.isAuthenticated()) {
                    return res.redirect(`/cart/${ user._id }`);
                } else {
                    return res.redirect(`/cart/guest`);
                }
            }


            const result = await this._paymentService.verifyPayment(orderId, orderInfo);
            if (result) {
                const message = {
                    message: 'Payment success',
                    type: 'success'
                }

                // return res.status(200).json(result);
                req.flash('flash', message);
                req.flash('result', {
                    message: 'Payment success',
                    type: 'primary',
                    amount: orderInfo.amount
                });
                if (req.isAuthenticated()) {
                    // return res.redirect(`/cart/${ user._id }`);
                    return res.redirect(`/cart/payment/result`);
                } else {
                    // remove product in cookie;
                    const products = req.cookies?.cart || null;
                    if (products) {
                        const productRequest = orderInfo.products;

                        console.log("New product")
                        const newProducts = products.filter(product => {
                            return !productRequest.some(productRequest => {
                                return productRequest.product === product.id;
                            })
                        });

                        console.log(newProducts);
                        res.cookie('cart', newProducts, { maxAge: 1000 * 60 * 60 * 24 * 30 });
                    }
                    return res.redirect(`/cart/payment/result`);
                }
            } else {
                const message = {
                    message: 'Payment failed',
                    type: 'danger'
                }

                req.flash('flash', message);


                return res.redirect(`/cart/payment/result`);
            }
        } else {
            const message = {
                message: 'Payment failed',
                type: 'danger'
            }

            req.flash('flash', message);
            // delete orderInfo session
            req.session.orderInfo = null;
            req.session.save();
            if (req.isAuthenticated()) {
                return res.redirect(`/cart/${ user._id }`);
            } else {
                return res.redirect(`/cart/guest`);
            }
        }
    }

    sortObject = ( obj ) => {
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
}


export default new PaymentController();