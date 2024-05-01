const moment = require("moment");
const { crifUserId, crifCustomerId, crifPassword, crifProductId } = require("../constantdata/config");


exports.getAccessCode = () => {
    let dateTimeStamp = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
    let string = `${crifUserId}|${crifCustomerId}|${crifProductId}|${crifPassword}|${dateTimeStamp}`
    const buff = Buffer.from(string, "utf8");
    const base64 = buff.toString("base64");

    return base64;
}
