import sendMail from "../utilz/sendMail.js";

export default async function ({ protocol, email, token, host }) {
    try {
        const verificationUrl = `${protocol}://${host}/api/auth/emailverification/${token}`
        const message = `To verify your email please click on this link. ${verificationUrl}`
        await sendMail({
            subject: "Email verification Link (Valid for only 5 minutes)",
            message,
            email: email
        })
    } catch (err) {
        throw Error("Error : " + err.message)
    }
}

