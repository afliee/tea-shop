import csv from "csvtojson";
import fs from 'fs';
import lodash from "lodash";
import path from "path";
import { Category, Product } from "#root/model/index.js";
import { PRODUCT_PATH, PUBLIC_PATH } from "#root/config/resource/multerConfig.js";

class ProductService {
    constructor() {
        this.HEADER = ['name', 'price', 'description', 'price', 'salePrice', 'quantity'];
        this.IMAGE_PATH = '/img/products';
    }

    getAll = async () => {
        //     get product group by category
        const products = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    products: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            price: "$price",
                            images: "$images",
                            description: "$description",
                            salePrice: "$salePrice",
                            quantity: "$quantity",
                            expiredAt: "$expiredAt",
                            createdAt: "$createdAt",
                            slug: "$slug",
                        }
                    }
                }
            }
        ]);
    //     populate category through _id
        const result = await Promise.all(products.map(async ( item ) => {
            const category = await Category.findById(item._id);
            return {
                category,
                products: item.products
            }
        }));

        return result;
    }

    extractData = async ( path, ext ) => {
        switch (ext) {
            // read csv file and extract data
            case 'csv':
                const products = await csv().fromFile(path);
                // check header of file
                if (!products.length || !this.HEADER.every(( item ) => products[0].hasOwnProperty(item))) {
                    return false;
                }

                // check header of file and validate data
                const categories = await Category.find({});
                const data = products.map(( item, index ) => {
                    const { name, description, price, salePrice, quantity } = item;
                    return {
                        index,
                        name,
                        description,
                        price,
                        salePrice,
                        quantity,
                        categories
                    }
                });

                // remove file after read
                fs.unlinkSync(path);
                return data;
                break;

            case 'xls':
            case 'xlsx':
                break;
        }
        return true;
    }

    create = async (data) => {
        try {
        //     data is array of product
            const products = data.map(( item ) => {
                const { name, description, price, salePrice, quantity, category } = item;
                const slug = lodash.kebabCase(name);
                return {
                    name,
                    slug,
                    description,
                    price,
                    salePrice,
                    quantity,
                    category
                }
            });

        //     insert products to database
            const result = await Product.insertMany(products);

            return result;
        } catch (e) {
            console.log(e);
            return false;
        }

    }

    update = async (id, data) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return false;
            }

            const { name, description, price, salePrice, category } = data;
            const slug = lodash.kebabCase(name);
            product.slug = slug;
            product.name = name;
            product.description = description;
            product.price = price;
            product.salePrice = salePrice;
            product.category = category;

            const result = await product.save();

            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    updateImage = async (id, path, ext = 'png') => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return false;
            }
            let targetPath = `${PRODUCT_PATH}/${id}.${ext}`;
            // rename and move file to img folder
            fs.renameSync(path, targetPath);
            targetPath = targetPath.replace(PUBLIC_PATH, '');
            product.images[0] = {
                url: targetPath
            }

            const result = await product.save();

            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    delete = async (id) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return false;
            }

            const result = await product.remove();

            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    getBySlug = async (slug) => {
        try {
        //     find product by slug with name
            const product = await Product.findOne({
                slug
            }).populate('category');

            return product;
        } catch (e) {
            return false;
        }
    }

    getById = async (id) => {
        try {
            const product = await Product.findById(id).populate('category');

            return product;
        } catch (e) {
            return false;
        }
    }

    getAllByIds = async (ids = [], selection = []) => {
        try {
            // const idsArray = ids.map(item => item.product)
            // console.log(idsArray);
            console.log("ids");
            console.log(ids);
            const products = await Product.find({
                _id: {
                    $in: ids
                }
            }).select(selection);
            return products;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default ProductService;