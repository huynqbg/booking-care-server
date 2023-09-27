import express from 'express';
import homeController from '../controllers/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD); // tao nguoi dung (template)
    router.post('/post-crud', homeController.postCRUD); // post nguoi dung len DB
    router.get('/get-crud', homeController.displayGetCRUD); // render user ra view

    return app.use('/', router);
};

module.exports = initWebRoutes;
