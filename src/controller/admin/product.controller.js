import { Product } from "#root/model/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { ProductService, CategoryService } from "#services/index.js";

class ProductController {
    constructor() {
        this._productService = new ProductService();
        this._categoryService = new CategoryService();
        this.IMAGE_ACCEPT = ['image/png', 'image/jpg', 'image/jpeg'];
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

    show = async (req, res) => {
        try {
            const id = req.params.id;
            const product = await Product.findById(id).populate('category').select('-__v');
            console.log(product);
            const categories = await this._categoryService.getAll();
            return res.render('layouts/util/product-detail.ejs', {
                user: req.user,
                product,
                categories
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

    update = async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            if (!data) {
                return res.status(400).json({ message: 'Data is required' });
            }

            const product = await this._productService.update(id, data);

            return res.status(200).json({ product , message: 'Update product successfully!', status: 200});
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    updateImage = async (req, res) => {
        try {
            const id = req.params.id;
            const file = req.file;

            const path = file.path;
            if (!this.IMAGE_ACCEPT.includes(file.mimetype)) {
                return res.status(400).json({ message: 'File type not supported' });
            }

            const ext = file.originalname.split('.').pop();

            const product = await this._productService.updateImage(id, path, ext);
            if (!product) {
                return res.status(400).json({ message: 'Product not found' });
            }

            return res.status(200).json({ product , message: 'Update product image successfully!', status: 200});
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    delete = async (req, res) => {
        try {
            const id = req.params.id;
            const result = await this._productService.delete(id);
            if (!result) {
                return res.status(400).json({ message: 'Product not found', status: 400 });
            }

            return res.status(200).json({ message: 'Delete product successfully!', status: 200});
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }
}

export default new ProductController();