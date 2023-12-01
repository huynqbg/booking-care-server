import db from '../models/index.js';

class ClinicService {
    createClinic(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (
                    !data.name ||
                    !data.descriptionHTML ||
                    !data.descriptionMarkdown ||
                    !data.imageBase64 ||
                    !data.address
                ) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameter',
                    });
                } else {
                    await db.Clinic.create({
                        name: data.name,
                        address: data.address,
                        image: data.imageBase64,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                    });
                    resolve({
                        errCode: 0,
                        message: 'OK',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ClinicService();
