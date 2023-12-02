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

    async bulkCreateSchedule(req, res) {
        try {
            let response = await DoctorService.bulkCreateSchedule(req.body);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async getScheduleDoctorByDate(req, res) {
        try {
            let response = await DoctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
    async getExtraInfoDoctorById(req, res) {
        try {
            let response = await DoctorService.getExtraInfoDoctorById(req.query.doctorId);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async getProfileDoctorById(req, res) {
        try {
            let response = await DoctorService.getProfileDoctorById(req.query.doctorId);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async getListPatientForDoctor(req, res) {
        try {
            let response = await DoctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }

    async sendRemedy(req, res) {
        try {
            let response = await DoctorService.sendRemedy(req.body);
            return res.status(200).json(response);
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
