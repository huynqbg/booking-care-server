import db from '../models/index.js';
import emailService from './emailService.js';

class PatientService {
    postBookAppointment(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter',
                    });
                } else {
                    await emailService.sendSimpleEmail({
                        receiverEmail: data.email,
                        time: '15:00 - 16:00 - Thứ hai - 27/11/2023',
                        doctorName: 'Nguyen Van A',
                        patientName: 'Hoang Nguyen',
                        redirectLink: `https://github.com/huynqbg`,
                    });

                    // upsert patient: nếu có thì update, không có thì insert
                    let user = await db.User.findOrCreate({
                        where: { email: data.email },
                        defaults: {
                            email: data.email,
                            roleId: 'R3',
                        },
                    });

                    // console.log(user[0]);

                    if (user && user[0]) {
                        await db.Booking.findOrCreate({
                            where: { patientId: user[0].id },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user[0].id,
                                date: data.date,
                                timeType: data.timeType,
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
}

module.exports = new PatientService();
