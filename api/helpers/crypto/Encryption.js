var Config = require(_pathconst.FilesPath.ConfigUrl);
var randomstring = require("randomstring");
var CryptoJS = require("crypto-js");
var crypto = require('crypto'),
    algorithm192 = 'aes-192-cbc',
    passCode = 'Anything which cant be encrypted';

const key = crypto.scryptSync(passCode, 'salt', 24);
const iv = Buffer.alloc(16, 0);

var crypto = require('crypto'),
    algorithm = 'aes-128-cbc';
let algorithmSha = "sha256"
exports.Encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm, Config.AES_KEY)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
exports.EncryptSha256 = function (text) {
    var cipher = crypto.createHash(algorithmSha, Config.AES_KEY);
    //  crypto.createCipher(algorithm, Config.AES_KEY)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
exports.Decrypt = function (text) {
    var decipher = crypto.createDecipher(algorithm, Config.AES_KEY)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
exports.createUserCode = function () {
    const threeDigitCode = randomstring.generate({
        length: 3,
        charset: 'numeric'
    });
    const timeStamp = Date.now() - 1584629547337;
    let userCode = "STP" + timeStamp;


    return userCode;
}
exports.decryptData = text => {
    var bytes = CryptoJS.AES.decrypt(text, Config.AES_KEY);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
exports.encryptData = text => {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), Config.AES_KEY).toString();
    return ciphertext;
};
exports.createUniConnectUserCode = function () {

    const threeDigitCode = randomstring.generate({
        length: 3,
        charset: 'numeric'
    });
    const timeStamp = Date.now() - 1584629547337;
    let userCode = "LUC" + timeStamp;


    return userCode;
}
exports.createUniValleyUserCode = function () {

    const threeDigitCode = randomstring.generate({
        length: 3,
        charset: 'numeric'
    });
    const timeStamp = Date.now() - 1584629547337;
    let userCode = "UNI" + timeStamp;

    return userCode;
}
exports.createIvyUserCode = function () {

    const threeDigitCode = randomstring.generate({
        length: 3,
        charset: 'numeric'
    });
    const timeStamp = Date.now() - 1584629547337;
    let userCode = "IVY" + timeStamp;

    return userCode;
}
exports.EncryptSha1 = function (string) {
    let sha1 = crypto.createHash('sha1').update(string).digest('hex');
    return sha1;
}
exports.encryptedPassword = (password) => {
    var salt = crypto.createHmac(algorithmSha, Config.AES_KEY).update((crypto.randomBytes(8).toString('hex'))).digest('hex');
    var cipher = crypto.createHmac(algorithmSha, Config.AES_KEY).update(salt + password).digest('hex');
    return (`${cipher} ${salt}`);
}
exports.encryptString = (text) => {
    const cipher = crypto.createCipheriv(algorithm192, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}