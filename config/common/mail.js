var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        // Email gửi đi
        user:"quynsph41939@fpt.edu.vn",
        // Mật khẩu Email
        pass:"wvbn eqcw tlfz zsia"
    }
})

module.exports = transporter