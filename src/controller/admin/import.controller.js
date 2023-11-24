import {ImportService} from "#services/index.js";

class ImportController {
    constructor() {
        this._importService = new ImportService();
    }

    index = async (req, res, next) => {
        const importEntities = await this._importService.getAll();
        // map to group by created date
        const groupByDate = importEntities.reduce(( acc, item ) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
        console.log(groupByDate);
        // map to group by supplier

        return res.render('layouts/admin/import.ejs', {
            user: req.user,
            importEntities: groupByDate
        });
    }

    approved = async (req, res, next) => {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }

        const importEntity = await this._importService.approved(id);
        return res.status(200).json({ importEntity });
    }

    rejected = async (req, res, next) => {
        const {id} = req.params;
        const {reason} = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }

        const importEntity = await this._importService.rejected(id, reason);
        return res.status(200).json({ importEntity });
    }
}

export default  new ImportController();