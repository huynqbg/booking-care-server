import PatientService from '../services/patientService';

class PatientController {
    async postBookAppointment(req, res) {
        try {
            let response = await PatientService.postBookAppointment(req.body);
            return res.status(200).json(response);
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
}

module.exports = new PatientController();
