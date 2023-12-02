import db from '../models';
require('dotenv').config();
import _, { includes } from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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

    checkRequiredFields(inputData) {
        const arrFields = [
            'doctorId',
            'contentHTML',
            'contentMarkdown',
            'action',
            'selectedPrice',
            'selectedPayment',
            'selectedProvince',
            'nameClinic',
            'addressClinic',
            'note',
            'specialtyId',
        ];
        let isValid = true;
        let element = '';
        for (let i = 0; i < arrFields.length; i++) {
            if (!inputData[arrFields[i]]) {
                isValid = false;
                element = arrFields[i];
                break;
            }
        }
        return { isValid, element };
    }
    saveDetailInfoDoctor(inputData) {
        return new Promise(async (resolve, reject) => {
            try {
                let check = this.checkRequiredFields(inputData);
                if (!check.isValid) {
                    resolve({
                        errCode: 1,
                        errMessage: `Missing parameter: ${check.element}`,
                    });
                } else {
                    // Upsert Markdown
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

                    // Upsert Doctor_Info table
                    let doctorInfo = await db.Doctor_Info.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    });

                    if (doctorInfo) {
                        // update
                        doctorInfo.doctorId = inputData.doctorId;
                        doctorInfo.priceId = inputData.selectedPrice;
                        doctorInfo.provinceId = inputData.selectedProvince;
                        doctorInfo.paymentId = inputData.selectedPayment;
                        doctorInfo.addressClinic = inputData.addressClinic;
                        doctorInfo.nameClinic = inputData.nameClinic;
                        doctorInfo.note = inputData.note;
                        doctorInfo.specialtyId = inputData.specialtyId;
                        doctorInfo.clinicId = inputData.clinicId;
                        await doctorInfo.save();
                    } else {
                        // create
                        await db.Doctor_Info.create({
                            doctorId: inputData.doctorId,
                            priceId: inputData.selectedPrice,
                            provinceId: inputData.selectedProvince,
                            paymentId: inputData.selectedPayment,
                            addressClinic: inputData.addressClinic,
                            nameClinic: inputData.nameClinic,
                            note: inputData.note,
                            specialtyId: inputData.specialtyId,
                            clinicId: inputData.clinicId,
                        });
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
                            {
                                model: db.Doctor_Info,
                                attributes: {
                                    exclude: ['id', 'doctorId'],
                                },
                                include: [
                                    { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                ],
                            },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (data && data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
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

    bulkCreateSchedule(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let schedule = data.arrSchedule;
                    if (schedule && schedule.length > 0) {
                        schedule = schedule.map((item) => {
                            item.maxNumber = MAX_NUMBER_SCHEDULE;
                            return item;
                        });
                    }

                    // get all existing schedule
                    let existing = await db.Schedule.findAll({
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true,
                    });

                    // compare difference schedule
                    let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                        return a.timeType === b.timeType && +a.date === +b.date;
                    });

                    // create Data
                    if (toCreate && toCreate.length > 0) {
                        await db.Schedule.bulkCreate(toCreate);
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getScheduleDoctorByDate(doctorId, date) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!doctorId || !date) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let data = await db.Schedule.findAll({
                        where: { doctorId, date },
                        include: [
                            {
                                model: db.Allcode,
                                as: 'timeTypeData',
                                attributes: ['valueEn', 'valueVi'],
                            },
                            { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (!data) data = [];

                    resolve({
                        errCode: 0,
                        data,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getExtraInfoDoctorById(doctorId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!doctorId) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let data = await db.Doctor_Info.findOne({
                        where: { doctorId },
                        attributes: {
                            exclude: ['id', 'doctorId'],
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (!data) data = {};

                    resolve({
                        errCode: 0,
                        data,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getProfileDoctorById(doctorId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!doctorId) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let data = await db.User.findOne({
                        where: { id: doctorId },
                        attributes: {
                            exclude: ['password'],
                        },
                        include: [
                            {
                                model: db.Markdown,
                                attributes: ['description', 'contentHTML', 'contentMarkdown'],
                            },
                            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                            {
                                model: db.Doctor_Info,
                                attributes: {
                                    exclude: ['id', 'doctorId'],
                                },
                                include: [
                                    { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                ],
                            },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (data && data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    }

                    if (!data) data = {};

                    resolve({
                        errCode: 0,
                        data,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getListPatientForDoctor(doctorId, date) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!doctorId || !date) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let listPatient = await db.Booking.findAll({
                        where: { doctorId: doctorId, date: date, statusId: 'S2' },
                        include: [
                            {
                                model: db.User,
                                as: 'patientData',
                                attributes: ['firstName', 'email', 'address', 'gender'],
                                include: [
                                    {
                                        model: db.Allcode,
                                        as: 'genderData',
                                        attributes: ['valueEn', 'valueVi'],
                                    },
                                ],
                            },
                            { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },
                        ],
                        raw: false,
                        nest: true,
                    });

                    if (!listPatient) listPatient = [];

                    resolve({
                        errCode: 0,
                        data: listPatient,
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new DoctorService();
