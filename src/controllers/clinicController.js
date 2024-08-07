import ClinicService from '../services/clinicService.js';

class ClinicController {
    async createClinic(req, res) {
        try {
            let response = await ClinicService.createClinic(req.body);
            return res.status(200).json(response);
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }

    async getAllClinics(req, res) {
        try {
            let response = await ClinicService.getAllClinics();
            return res.status(200).json(response);
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }

    async getDetailClinicById(req, res) {
        try {
            let response = await ClinicService.getDetailClinicById(req.query.id);
            return res.status(200).json(response);
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }
}

module.exports = new ClinicController();
