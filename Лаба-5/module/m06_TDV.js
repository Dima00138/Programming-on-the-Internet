const nm = require('nodemailer');

function send(sender, password, receiver, message){
    let transporter = nm.createTransport(
        {
            service: 'Gmail',
            auth: {
                user : sender,
                pass : password
            }
        }
    );

    var mailOptions = {
        from: sender,
        to: receiver,
        subject: 'THEME',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        error ? console.log(error) : console.log('Email sent: ' + info.response);
    })
};

module.exports = send;