import db from "../models";

class homeController {
    async getHomePage(req, res) {
        try {
            let data = await db.User.findAll();
            res.render('homepage.ejs', { data: JSON.stringify(data) });
        } catch (error) {
            console.log(error);
        }
       
    }
}

module.exports = new homeController
