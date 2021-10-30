const send = require('./nodemailer')

let from = `Expense Split <i***@gmail.com>`
const sendEmail = (emailTo, text) => {
    const emailOptions = {
        subject: 'Expense Split Notification',
        text: text,
        to: emailTo,
        from: from,
    }

    send(emailOptions);
    console.log(`Email sent to ${emailTo}`)
}


module.exports = sendEmail


