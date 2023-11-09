import { Category, Product } from "#root/model/index.js";
import { CATEGORY_PATH, PRODUCT_PATH, PUBLIC_PATH } from "#root/config/resource/multerConfig.js";
import fs from "fs";

class CategoryService {
    constructor() {

    }

    getAll = async () => {
        const categories = await Category.find({});
        return categories;
    }

    updateImage = async (id, path, ext = 'png') => {
        try {
            const category = await Category.findById(id);
            if (!category) {
                return false;
            }
            let targetPath = `${CATEGORY_PATH}/${id}.${ext}`;
            // rename and move file to img folder
            fs.renameSync(path, targetPath);
            targetPath = targetPath.replace(PUBLIC_PATH, '');
            category.image = targetPath;

            const result = await category.save();

            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default CategoryService;