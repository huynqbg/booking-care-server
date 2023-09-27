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

    async displayGetCRUD(req, res) {
        let data = await CRUDService.getAllUser();
        res.render('displayCRUD.ejs', { data });
    }

    async getEditCRUD(req, res) {
        let userId = req.query.id;
        if (userId) {
            let userData = await CRUDService.getUserInfoById(userId);
            res.render('editCRUD.ejs', { user: userData });
        } else {
            res.send('User not found !!!');
        }
    }

    async putCRUD(req, res) {
        let data = req.body;
        await CRUDService.UpdateUserData(data);
        res.redirect('/get-crud');
    }
}

module.exports = new homeController();
