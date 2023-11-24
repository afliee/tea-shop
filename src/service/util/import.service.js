import * as XLSX from 'xlsx';
import csv from 'csvtojson';
import { Import, Ingredient, Supplier, Category } from "#models/index.js";
import {sendEmail} from "#utils/email.utils.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

class ImportServer {

    constructor() {
        //   bind methods
        this.extractDataFromFile = this.extractDataFromFile.bind(this);
        this.HEADER = ['name', 'description', 'price', 'quantity', 'expiredAt'];
    }

    async extractDataFromFile( filePath, ext ) {
        console.log(filePath, ext);
        switch (ext) {
            // read csv file and extract data
            case 'csv':
                const products = await csv().fromFile(filePath);
                // check header of file
                if (!products.length || !this.HEADER.every(( item ) => products[0].hasOwnProperty(item))) {
                    console.log("header file not match");
                    return false;
                }

                // check header of file and validate data
                const units = ['kg', 'g', 'l', 'ml'];
                const data = products.map(( item, index ) => {
                    const { name, description, price, quantity, expiredAt } = item;
                    return {
                        name,
                        description,
                        price,
                        quantity,
                        expiredAt,
                        index,
                        units
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

    async create(supplier ,data ) {
        let total = 0;
        const ingredients = await Promise.all(data.map(async ( item ) => {
            const { name, description, price, quantity, expiredAt, units } = item;
            total += price * quantity;
            const ingredient = await Ingredient.create({
                name,
                description,
                price,
                quantity,
                expiredAt,
                units
            });
            return ingredient;
        }));

        const importData = await Import.create({
            supplier: supplier._id,
            ingredients: ingredients.map(( item ) => item._id),
            total,
            status: 'pending'
        });
        return importData;
    }

    async getAll() {
        // populate supplier and all ingredients with ingredients: [{_id: ...}]
        /*
        * import {
        *  supplier: {
        *     name: ...
        * },
        * ingredients: [
        *  {
        *    _id: new ObjectId('...'),
        * },
        * {
        *   _id: new ObjectId('...'),
        * }
        * ]
        * */
        const imports = await Import.find({}).populate({
            path: 'supplier',
            select: 'name'
        }).populate({
            path: 'ingredients',
            select: '-__v'
        })

        // populate content of ingredients
        // imports.forEach(( item ) => {
        //     item.ingredients.forEach(( ingredient ) => {
        //         ingredient.populate('_id');
        //     });
        // });

        return imports;
    }

    approved = async (id) => {
        const importEntity = await Import.findById(id).populate('supplier').populate('ingredients');
        if (!importEntity) {
            throw new Error('Import not found');
        }

        if (importEntity.status !== 'pending') {
            throw new Error('Import is not pending');
        }

        importEntity.status = 'approved';
        await importEntity.save();

        // update quantity of ingredients
        const ingredients = await Ingredient.find({
            _id: {
                $in: importEntity.ingredients
            }
        });

        ingredients.forEach(( ingredient ) => {
            const quantity = importEntity.ingredients.find(( item ) => item._id.toString() === ingredient._id.toString()).quantity;
            ingredient.quantity += quantity;
            ingredient.save();
        });

        return importEntity;
    }

    rejected = async (id, reason) => {
        const importEntity = await Import.findById(id).populate('supplier').populate('ingredients');
        if (!importEntity) {
            return ErrorMessage(500, 'Import not found')
        }

        if (importEntity.status !== 'pending') {
            return ErrorMessage(500, 'Import is not pending')
        }

        importEntity.status = 'rejected';
        await importEntity.save();

        const options = {
            email: importEntity.supplier.email,
            subject: 'Import',
            template: 'import-rejected',
            context: {
                name: importEntity.supplier.name,
                ingredients: importEntity.ingredients,
                reason
            }
        }

        await sendEmail(options);
        return importEntity;
    }
}

export default ImportServer;