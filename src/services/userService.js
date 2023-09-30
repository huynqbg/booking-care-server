import db from '../models';
import bcrypt from 'bcryptjs';

class userService {
    handleUserLogin(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                let userData = {};
                // check email co ton tai tren system ko
                let isExist = await this.checkUserEmail(email);
                if (isExist) {
                    let user = await db.User.findOne({
                        where: { email: email },
                        attributes: ['email', 'roleId', 'password'],
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
}

module.exports = new userService();
