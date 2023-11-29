import db from '../models/index.js';

class SpecialtyService {
    createSpecialty(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.imageBase64) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameter',
                    });
                } else {
                    await db.Specialty.create({
                        name: data.name,
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

module.exports = new SpecialtyService();
