const AWS = require('aws-sdk');
var pdf = require('html-pdf');
const moment = require('moment');
var Config = require(_pathconst.FilesPath.ConfigUrl);

const s3 = new AWS.S3({
    accessKeyId: Config.s3accessKeyId,
    secretAccessKey: Config.s3secretAccessKey,
    region: Config.regionSouth
});

exports.base64s3Upload = async (base64, fileName, bucketName) => {
    const contentType = base64.split(':')[1].split(";")[0]
    var type = base64.split(';')[0].split('/')[1];
    var base64Data;
    if (contentType === "application/vnd.ms-excel") {
        type = "xls";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        type = "xlsx";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        type = "docx";
    }
    else if (contentType === "application/msword") {
        type = "doc";
    }
    else if (contentType === "application/vnd.ms-powerpoint") {
        type = "ppt";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        type = "pptx";
    }
    else if (contentType === "application/pdf") {
        type = "pdf";
    }
    else if (contentType === "image/jpeg") {
        type = "jpg";
    }
    else if (contentType === "image/png") {
        type = "png";
    }


    base64Data = new Buffer.from(base64.split("base64,")[1], "base64");
    const date = Date.now();
    const params = {
        Bucket: `${bucketName}`,
        Key: `${fileName}_${date}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        delimiter: "",
        ContentEncoding: 'base64', // required
        ContentType: contentType
    }

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    }
    catch (e) {
        return { error: e };
    }
}

exports.base64s3UploadCompressed = async (base64, fileName, bucketName) => {
    const contentType = base64.split(':')[1].split(";")[0];
    var type = base64.split(';')[0].split('/')[1];
    var base64Data;
    if (contentType === "application/vnd.ms-excel") {
        type = "xls";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        type = "xlsx";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        type = "docx";
    }
    else if (contentType === "application/msword") {
        type = "doc";
    }
    else if (contentType === "application/vnd.ms-powerpoint") {
        type = "ppt";
    }
    else if (contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        type = "pptx";
    }
    else if (contentType === "application/pdf") {
        type = "pdf";
    }
    else if (contentType === "image/jpeg") {
        type = "jpg";
    }
    else if (contentType === "image/png") {
        type = "png";
    }


    base64Data = new Buffer.from(base64.split("base64,")[1], "base64");
    const date = Date.now();
    const params = {
        Bucket: `${bucketName}`,
        Key: `${fileName}_medium.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        delimiter: "",
        ContentEncoding: 'base64', // required
        ContentType: contentType
    }

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    }
    catch (e) {
        return { error: e };
    }
}
exports.htmlToPdfWithoutSaving = (html) => {
    return new Promise(async (resolve, reject) => {
        try {
            pdf.create(html).toBuffer(async function (err, buffer) {
                if (err) {
                    reject(err);
                }
                else {
                    const newBuff = new Buffer.from(buffer);
                    let base64data = newBuff.toString('base64');
                    // const buff = new Buffer.from(`data:application/pdf;base64,${base64data}`.split("base64,")[1],"base64")

                    resolve(base64data);
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}


exports.htmlSaveAsPdf = (html, userName, bucketName) => {
    return new Promise(async (resolve, reject) => {
        try {
            pdf.create(html).toBuffer(async function (err, buffer) {
                if (err) {
                    reject(err);
                }
                else {
                    const newBuff = new Buffer.from(buffer);
                    const params = {
                        Bucket: `${bucketName}`,
                        Key: `${userName}_SOP_${moment().format("MMDD_YY_HH:MM")}`,
                        Body: newBuff,
                        ACL: 'public-read',
                        delimiter: "",
                        ContentType: "application/pdf"
                    }
                    const result = await s3.upload(params).promise();
                    resolve(result);
                }
            })
        } catch (error) {
            console.log(error)
            reject(error);
        }
    });
}

exports.getbase64 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            s3.getObject(data, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}


// test();