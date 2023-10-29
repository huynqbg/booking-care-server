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
}

module.exports = new DoctorController();
