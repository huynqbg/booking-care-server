const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('huynq', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection successfully.');
    } catch (error) {
        console.error('Connection Fail !!!', error);
    }
};

module.exports = connectDB;
