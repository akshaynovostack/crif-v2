const crypto = require('crypto');
const { SECRET_KEY } = require('../constantdata/config');

// Function to encrypt data
exports.encryptAes256 = (text) => {
    const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Function to decrypt data
exports.decryptAes256 = (encryptedText) => {
    const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

exports.encodeToBase64 = (data) => {
    return Buffer.from(data).toString('base64');
}

// Function to decode base64 data string
exports.decodeFromBase64 = (base64Data) => {
    return Buffer.from(base64Data, 'base64').toString('utf-8');
}