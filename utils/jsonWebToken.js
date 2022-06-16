const JWT = require("jsonwebtoken");
const randomString = require("randomstring");
const secret = randomString.generate(); //随机生成私钥
function createToken(Payload) {
    return JWT.sign(Payload, secret, { expiresIn: 43200 }); //生成token
}
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, secret, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
module.exports = {
    createToken,
    verifyToken,
};
