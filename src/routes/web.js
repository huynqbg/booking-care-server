import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD); // tao nguoi dung (template)
    router.post('/post-crud', homeController.postCRUD); // post nguoi dung len DB
    router.get('/get-crud', homeController.displayGetCRUD); // render user ra view
    router.get('/edit-crud', homeController.getEditCRUD); // edit user
    router.post('/put-crud', homeController.putCRUD); // put user len DB
    router.get('/delete-crud', homeController.deleteCRUD); // delete user on DB

    // viet chuan RESTful API
    router.post('/api/login', userController.handleLogin); // api login
    router.get('/api/get-all-users', userController.handleGetAllUsers); // api get all user
    router.post('/api/create-new-user', userController.handleCreateNewUser); // add user
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    return app.use('/', router);
};

module.exports = initWebRoutes;
