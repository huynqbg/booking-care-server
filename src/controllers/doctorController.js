import DoctorService from '../services/doctorService';

class DoctorController {
    async getTopDoctorHome(req, res) {
        let limit = req.query.limit;
        if (!limit) limit = 10;
        try {
            let response = await DoctorService.getTopDoctorHome(+limit);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error form server...',
            });
        }
    }

    async getAllDoctors(req, res) {
        try {
            let doctors = await DoctorService.getAllDoctors();
            res.status(200).json(doctors);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async postInfoDoctor(req, res) {
        try {
            let response = await DoctorService.saveDetailInfoDoctor(req.body);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async getDetailDoctorById(req, res) {
        try {
            let info = await DoctorService.getDetailDoctorById(req.query.id);
            return res.status(200).json(info);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
}

module.exports = new DoctorController();
