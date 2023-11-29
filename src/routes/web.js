import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import DoctorController from '../controllers/doctorController';
import PatientController from '../controllers/patientController';
import SpecialtyController from '../controllers/specialtyController';

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
    router.get('/api/allcode', userController.getAllCode);

    // doctor
    router.get('/api/get-all-doctors', DoctorController.getAllDoctors);
    router.get('/api/top-doctor-home', DoctorController.getTopDoctorHome);
    router.post('/api/save-info-doctor', DoctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', DoctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', DoctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', DoctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-info-doctor-by-id', DoctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', DoctorController.getProfileDoctorById);

    // patient
    router.post('/api/patient-book-appointment', PatientController.postBookAppointment);
    router.post('/api/verify-book-appointment', PatientController.postVerifyBookAppointment);

    //specialty
    router.post('/api/create-new-specialty', SpecialtyController.createSpecialty);
    router.get('/api/get-all-specialty', SpecialtyController.getAllSpecialties);

    return app.use('/', router);
};

module.exports = initWebRoutes;
