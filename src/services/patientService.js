import db from '../models/index.js';
require('dotenv').config();
import emailService from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

class PatientService {
    buildUrlEmail(doctorId, token) {
        return `${process.env.URL_CLIENT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    }

    postBookAppointment(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let token = uuidv4();
                    // send email: nodemailer
                    await emailService.sendSimpleEmail({
                        receiverEmail: data.email,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        patientName: data.fullName,
                        language: data.language,
                        redirectLink: this.buildUrlEmail(data.doctorId, token),
                    });

                    // upsert patient: nếu có thì update, không có thì insert
                    let user = await db.User.findOrCreate({
                        where: { email: data.email },
                        defaults: {
                            email: data.email,
                            roleId: 'R3',
                        },
                    });

                    if (user && user[0]) {
                        await db.Booking.findOrCreate({
                            where: { patientId: user[0].id },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user[0].id,
                                date: data.date,
                                timeType: data.timeType,
                                token: token,
                            },
                        });
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Save info patient success',
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    postVerifyBookAppointment(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.token || !data.doctorId) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    let response = await db.Booking.findOne({
                        where: {
                            token: data.token,
                            doctorId: data.doctorId,
                            statusId: 'S1',
                        },
                        raw: false,
                    });

                    if (response) {
                        response.statusId = 'S2';
                        await response.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Update the appointment success',
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Appointment has been activated or does not exist',
                        });
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = new PatientService();
