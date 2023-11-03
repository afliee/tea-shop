import * as XLSX from 'xlsx';
import csv from 'csvtojson';
import { Import, Product, Supplier, Category } from "#models/index.js";

class ImportServer {

    constructor() {
        //   bind methods
        this.extractDataFromFile = this.extractDataFromFile.bind(this);
        this.HEADER = ['name', 'description', 'price', 'sellPrice', 'quantity', 'expiredAt', 'type', 'expiredAt'];
    }

    async extractDataFromFile( filePath, ext ) {
        console.log(filePath, ext);
        switch (ext) {
            // read csv file and extract data
            case 'csv':
                const products = await csv().fromFile(filePath);
                // check header of file
                if (!products.length || !this.HEADER.every(( item ) => products[0].hasOwnProperty(item))) {
                    return false;
                }

                // check header of file and validate data
                const categories = await Category.find({});
                const data = products.map(( item ) => {
                    const { name, description, price, sellPrice, quantity, expiredAt, type } = item;
                    return {
                        name,
                        description,
                        price,
                        sellPrice,
                        quantity,
                        type,
                        expiredAt,
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
}

export default ImportServer;