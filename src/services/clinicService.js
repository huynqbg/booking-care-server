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

    getAllClinics() {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.Clinic.findAll();
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                        return item;
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getDetailClinicById(clinicId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!clinicId) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameter',
                    });
                } else {
                    let data = await db.Clinic.findOne({
                        where: { id: clinicId },
                        attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                    });
                    if (data) {
                        let doctorClinic = [];
                        doctorClinic = await db.Doctor_Info.findAll({
                            where: { clinicId: clinicId },
                            attributes: ['doctorId', 'provinceId'],
                        });

                        data.doctorClinic = doctorClinic;
                    } else {
                        data = {};
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                        data: data,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ClinicService();
