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
        html: getBodyHTMLEmail(dataSend), // html body
    });
};

let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Huy Nguyen Admin 👻" <huynq2x@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: 'Kết quả đặt lịch khám bệnh', // Subject line
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [
            {
                filename: `prescription-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let html = '';
    if (dataSend.language === 'vi') {
        html = `
            <h3> Xin chào ${dataSend.patientName}! </h3>
            <p> Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Huynq BookingCare </p>
            <p> Thông tin lịch khám của bạn như sau: </p>
            <div><b> Thời gian: ${dataSend.time} </b></div>
            <div><b> Bác sĩ: ${dataSend.doctorName} </b></div>

            <p> Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận lịch khám và hoàn tất thủ tục khám bệnh </p>
            <div> <a href="${dataSend.redirectLink}" target="_blank"> Click vào đây để xác nhận lịch khám </a> </div>
            
            <div> Trân trọng cảm ơn! </div> 
        `;
    } else if (dataSend.language === 'en') {
        html = `
            <h3> Dear ${dataSend.patientName}! </h3>
            <p> You received this email because you have booked an online appointment on Huynq BookingCare </p>
            <p> Your appointment information is as follows: </p>
            <div><b> Time: ${dataSend.time} </b></div>
            <div><b> Doctor: ${dataSend.doctorName} </b></div>

            <p> If the above information is true, please click on the link below to confirm your appointment and complete the examination procedure </p>
            <div> <a href="${dataSend.redirectLink}" target="_blank"> Click here to confirm the appointment </a> </div>
            
            <div> Thank you! </div> 
        `;
    }
    return html;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
    let html = '';
    if (dataSend.language === 'vi') {
        html = `
            <h3> Xin chào ${dataSend.patientName}! </h3>
            <p> Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Huynq BookingCare </p>
            <p> Thông tin đơn thuốc của bạn được gửi trong file đính kèm. </p>
            
            <div> Trân trọng cảm ơn! </div> 
        `;
    } else if (dataSend.language === 'en') {
        html = `
            <h3> Dear ${dataSend.patientName}! </h3>
            <p> You received this email because you have booked an online appointment on Huynq BookingCare </p>
            <p> Your prescription information is attached. </p>
            
            <div> Thank you! </div> 
        `;
    }
    return html;
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
};
