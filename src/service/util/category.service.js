import {Category} from "#root/model/index.js";

class CategoryService {
    constructor() {

    }

    getAll = async () => {
        const categories = await Category.find({});
        return categories;
    }
}

export default CategoryService;