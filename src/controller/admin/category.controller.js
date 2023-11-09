import { Category } from "#root/model/index.js";
import { CategoryService } from "#services/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

class CategoryController {
    constructor() {
        this._categoryService = new CategoryService();
    }

    index = async ( req, res ) => {
        try {
            const categories = await Category.find();
            return res.render('layouts/admin/category.ejs', {
                user: req.user,
                categories,
                flash: {
                    message: req.flash('message') || null,
                    type: req.flash('type') || null
                }
            })
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    add = async ( req, res ) => {
        try {
            const { name, description } = req.body;
            const category = new Category({
                name,
                description
            });
            await category.save();
            req.flash('message', 'Successfully created category');
            req.flash('type', 'success');
            return res.redirect('/admin/categories');
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    update = async ( req, res ) => {
        try {
            const id = req.params.id;
            const { name, description } = req.body;

            const category = await Category.findById(id);
            if (!category) {
                req.flash('message', 'Category not found');
                req.flash('type', 'error');
                return res.redirect('/admin/categories');
            }

            category.name = name;
            category.description = description;

            await category.save();
            req.flash('message', 'Successfully updated category');
            req.flash('type', 'success');
            return res.redirect('/admin/categories');
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    updateImage = async ( req, res ) => {
        try {
            const { id } = req.params;
            const { path } = req.file;
            const ext = path.split('.').pop();
            const result = await this._categoryService.updateImage(id, path, ext)

            if (!result) {
                return res.status(500).json(ErrorMessage(500, 'Update image failed'))
            }

            return res.status(200).json({
                message: 'Update image successfully',
                data: result
            });
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }
}

export default new CategoryController();