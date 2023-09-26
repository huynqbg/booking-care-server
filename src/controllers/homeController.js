import db from '../models';
import CRUDService from '../services/CRUDService';

class homeController {
    async getHomePage(req, res) {
        try {
            let data = await db.User.findAll();
            res.render('homepage.ejs', { data: JSON.stringify(data) });
        } catch (error) {
            console.log(error);
        }
    }

    getCRUD(req, res) {
        res.render('crud.ejs');
    }

    async postCRUD(req, res) {
        let message = await CRUDService.createNewUser(req.body);
        res.json(req.body);
        console.log(message);
    }
}

module.exports = new homeController();
