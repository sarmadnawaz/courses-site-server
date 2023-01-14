import sendMail from "./sendMail.js";
async function sendResetPasswordToken({ protocol, token, host, email}) {
    try {
        const verificationUrl = `${protocol}://${host}/api/auth/resetpassword/${token}`
        const message = `To reset your password please click on this link. ${verificationUrl}. If you havent requested Please ignore. 🫡🫡`
        await sendMail({
            subject: "Password Reset Token (Valid for only 5 minutes)",
            message,
            email: email
        })
    } catch (err) {
        throw Error("Error : " + err.message)
    }
}

export default sendResetPasswordToken;
