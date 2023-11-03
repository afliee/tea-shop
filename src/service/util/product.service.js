import csv from "csvtojson";

import { Category, Product } from "#root/model/index.js";

class ProductService {
    constructor() {
        this.HEADER = ['name', 'price', 'description', 'price', 'salePrice', 'quantity'];
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
                            description: "$description",
                            salePrice: "$salePrice",
                            quantity: "$quantity",
                            expiredAt: "$expiredAt",
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
                return {
                    name,
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
}

export default ProductService;