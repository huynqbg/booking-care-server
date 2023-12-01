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

    getAllSpecialties() {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.Specialty.findAll({
                    attributes: ['id', 'name', 'image', 'descriptionHTML', 'descriptionMarkdown'],
                });
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
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

    getDetailSpecialtyById(id, location) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || !location) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameter',
                    });
                } else {
                    let data = await db.Specialty.findOne({
                        where: { id: id },
                        attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'], // có thể lấy thêm image
                    });
                    if (data) {
                        // data.image = Buffer.from(data.image, 'base64').toString('binary');
                        let doctorSpecialty = [];
                        if (location === 'ALL') {
                            doctorSpecialty = await db.Doctor_Info.findAll({
                                where: { specialtyId: id },
                                attributes: ['doctorId', 'provinceId'],
                            });
                        } else {
                            doctorSpecialty = await db.Doctor_Info.findAll({
                                where: { specialtyId: id, provinceId: location },
                                attributes: ['doctorId', 'provinceId'],
                            });
                        }

                        data.doctorSpecialty = doctorSpecialty;
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

module.exports = new SpecialtyService();
