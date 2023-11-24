import {ImportService} from "#services/index.js";

class ImportController {
    constructor() {
    //     bind methods
        this.handleUpload = this.handleUpload.bind(this);
        this._importService = new ImportService();
    }

    async handleUpload(req, res, next) {
    //     get file csv from request
        const file = req.file;
        const fileName = file.originalname;
        const ext = fileName.split('.').pop();

        if (!['csv', 'xls', 'xlsx'].includes(ext)) {
            return res.status(400).json({ message: 'File type not supported' });
        }

        // read and extract data from file
        const data =  await this._importService.extractDataFromFile(file.path, ext);

        return res.status(200).json({ data });

    }

    create = async (req, res, next) => {
        const data = req.body;
        console.log("Import Controller", data);
        if (!data || !data.length) {
            return res.status(400).json({ message: 'Data is required' });
        }

        const products = await this._importService.create(req.user,data);

        return res.status(200).json({ products });
    }
}

export default new ImportController();