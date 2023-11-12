import db from '../models';

class DoctorService {
    getTopDoctorHome(limit) {
        return new Promise(async (resolve, reject) => {
            try {
                let users = await db.User.findAll({
                    limit,
                    where: { roleId: 'R2' },
                    order: [['createdAt', 'DESC']],
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'genderData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: users,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getAllDoctors() {
        return new Promise(async (resolve, reject) => {
            try {
                let doctors = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: {
                        exclude: ['password', 'image'],
                    },
                });
                resolve({
                    errCode: 0,
                    data: doctors,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    saveDetailInfoDoctor(inputData) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameter',
                    });
                } else {
                    if (inputData.action === 'CREATE') {
                        await db.Markdown.create({
                            contentHTML: inputData.contentHTML,
                            contentMarkdown: inputData.contentMarkdown,
                            description: inputData.description,
                            doctorId: inputData.doctorId,
                        });
                    } else if (inputData.action === 'EDIT') {
                        let doctorMarkdown = await db.Markdown.findOne({
                            where: { doctorId: inputData.doctorId },
                            raw: false,
                        });

                        if (doctorMarkdown) {
                            doctorMarkdown.contentHTML = inputData.contentHTML;
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                            doctorMarkdown.description = inputData.description;
                            await doctorMarkdown.save();
                        }
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'Save info Doctor successfully',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getDetailDoctorById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter id',
                    });
                } else {
                    let data = await db.User.findOne({
                        where: { id },
                        attributes: {
                            exclude: ['password'],
                        },
                        include: [
                            {
                                model: db.Markdown,
                                attributes: ['description', 'contentHTML', 'contentMarkdown'],
                            },
                            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (data && data.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary');
                    }

                    if (!data) data = {};

                    resolve({
                        errCode: 0,
                        data: data,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new DoctorService();
