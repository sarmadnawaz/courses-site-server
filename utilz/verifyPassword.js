import bcrypt from 'bcrypt';
export default async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}