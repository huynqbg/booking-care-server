/** @format */

import db from '../models';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

class userService {
    hashUserPassword(password) {
        return new Promise(async (resolve, reject) => {
            try {
                let hashPassword = await bcrypt.hashSync(password, salt);
                resolve(hashPassword);
            } catch (error) {
                reject(error);
            }
        });
    }

    handleUserLogin(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                let userData = {};
                // check email co ton tai tren system ko
                let isExist = await this.checkUserEmail(email);
                if (isExist) {
                    let user = await db.User.findOne({
                        where: { email: email },
                        attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                        raw: true,
                    });
                    if (user) {
                        // check password user input with password in DB
                        let check = bcrypt.compareSync(password, user.password);
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = 'Ok';
                            delete user.password; // xoa de khong hien thi password
                            userData.user = user; // du lieu user
                        } else {
                            userData.errCode = 3;
                            userData.errMessage = 'Wrong Password';
                        }
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = 'User not found !';
                    }
                } else {
                    userData.errCode = 1;
                    userData.errMessage = `Your Email isn't exist in system. Please try other email.`;
                }
                resolve(userData);
            } catch (error) {
                reject(error);
            }
        });
    }

    checkUserEmail(userEmail) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { email: userEmail },
                });
                if (user) resolve(true);
                else resolve(false);
            } catch (error) {
                reject(error);
            }
        });
    }

    getAllUsers(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                let users = '';
                if (userId === 'ALL') {
                    users = await db.User.findAll({
                        attributes: {
                            exclude: ['password'],
                        },
                    });
                }
                if (userId && userId !== 'ALL') {
                    users = await db.User.findOne({
                        where: { id: userId },
                        attributes: {
                            exclude: ['password'],
                        },
                    });
                }
                resolve(users);
            } catch (error) {
                reject(error);
            }
        });
    }

    createNewUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let check = await this.checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email has already used. Please try another email',
                    });
                } else {
                    let hashPasswordFromBcrypt = await this.hashUserPassword(data.password);
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        roleId: data.roleId,
                        positionId: data.positionId,
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

    updateUserData(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Missing required parameter!',
                    });
                }
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.roleId = data.roleId;
                    user.positionId = data.positionId;
                    user.gender = data.gender;
                    user.phoneNumber = data.phoneNumber;

                    await user.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update User success',
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'User not found!',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteUser(userId) {
        return new Promise(async (resolve, reject) => {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'The user not exist',
                });
            }
            await db.User.destroy({
                where: { id: userId },
            });

            resolve({
                errCode: 0,
                errMessage: 'The user is deleted',
            });
        });
    }

    getAllCodeService(typeInput) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!typeInput) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameter !',
                    });
                } else {
                    let res = {};
                    let allcode = await db.Allcode.findAll({
                        where: { type: typeInput },
                    });
                    res.errCode = 0;
                    res.data = allcode;
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new userService();
