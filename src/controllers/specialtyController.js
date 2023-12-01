import SpecialtyService from '../services/specialtyService';

class SpecialtyController {
    async createSpecialty(req, res) {
        try {
            let response = await SpecialtyService.createSpecialty(req.body);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }

    async getAllSpecialties(req, res) {
        try {
            let response = await SpecialtyService.getAllSpecialties();
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }

    async getDetailSpecialtyById(req, res) {
        try {
            let response = await SpecialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server',
            });
        }
    }
}

module.exports = new SpecialtyController();
