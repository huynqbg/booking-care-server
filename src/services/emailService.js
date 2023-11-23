require('dotenv').config();
const nodemailer = require('nodemailer');

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Huy Nguyen Admin 👻" <huynq2x@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'Thông tin đặt lịch khám bệnh', // Subject line
        html: `
            <h3> Xin chào ${dataSend.patientName}! </h3>
            <p> Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Huynq BookingCare </p>
            <p> Thông tin lịch khám của bạn như sau: </p>
            <div><b> Thời gian: ${dataSend.time} </b></div>
            <div><b> Bác sĩ: ${dataSend.doctorName} </b></div>

            <p> Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận lịch khám và hoàn tất thủ tục khám bệnh </p>
            <div> <a href="${dataSend.redirectLink}" target="_blank"> Click vào đây để xác nhận lịch khám </a> </div>
            
            <div> Trân trọng cảm ơn! </div>
            `, // html body
    });
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
};
