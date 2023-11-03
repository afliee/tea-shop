import { Product } from "#root/model/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { ProductService } from "#services/index.js";

class ProductController {
    constructor() {
        this._productService = new ProductService();
    }

    index = async ( req, res ) => {
        try {
            const categories =await this._productService.getAll();
            console.log(categories);
            return res.render('layouts/admin/product.ejs', {
                user: req.user,
                categories,
            })
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    upload = async (req, res) => {
        const file = req.file;
        const fileName = file.originalname;
        const ext = fileName.split('.').pop();

        if (!['csv', 'xls', 'xlsx'].includes(ext)) {
            return res.status(400).json({ message: 'File type not supported' });
        }

        // read and extract data from file
        const data =  await this._productService.extractData(file.path, ext);

        return res.status(200).json({ data });
    }

    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ message: 'Data is required' });
            }

            const products = await this._productService.create(data);

            return res.status(200).json({ products , message: 'Create product successfully!'});
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }
}

export default new ProductController();