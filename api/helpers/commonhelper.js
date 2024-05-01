const moment = require("moment");
const { date } = require("joi");
const pdf2base64 = require('pdf-to-base64');
let AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
let pdf = require("html-pdf");

let currentTime = new Date();
let currentOffset = currentTime.getTimezoneOffset();
let ISTOffset = 330;

exports.removeSpecialCharacter = function (string) {
    let finalString = string.replace(/[^a-zA-Z ]/g, "");
    return finalString;
}
exports.asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}
exports.asyncForEachObject = async (array, callback) => {
    for (const [key, value] of Object.entries(array)) {
        // console.log(`${key}: ${value}`);
        await callback(key, value, array)

    }
}

exports.uploadToS3 = async function (userId, file, t, ContentType, typ) {
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

    AWS.config.setPromisesDependency(require('bluebird'));
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

    const s3 = new AWS.S3();

    const base64Data = new Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    let type;
    if (typ) {
        type = typ;
    } else {
        type = file.split(';')[0].split('/')[1];
    }
    let k;
    if (!ContentType) {
        ContentType = `image/${type}`;
    }
    // console.log(type)
    if (ContentType == 'application/octet-stream') {
        k = `${userId}/${userId}_${t}.${typ}`;
    } else {
        k = `${userId}/${userId}_${t}.${type}`
    }
    const params = {
        Bucket: S3_BUCKET,
        Key: k, // type is not required
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType // required. Notice the back ticks
    }

    let location = '';
    let key = '';

    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;


    return location;

}
exports.getDate = (date) => {
    if (date) {
        date = date.toDateString().split("T");
        return date[0];
    }
    return "";
}
exports.capitalizeFLetter = (input) => {
    return input.replace(/^./, input[0].toUpperCase());
}

exports.getUniqueKeys = (array, keyName) => {
    var flags = [], output = [], l = array.length, i;
    for (i = 0; i < l; i++) {
        if (flags[array[i][keyName]]) continue;
        flags[array[i][keyName]] = true;
        output.push(array[i][keyName]);
    }
    return output;
}

// exports.comparer = (otherArray) => {
//     return function (current) {
//         return otherArray.filter(function (other) {
//             return other.value == current.value && other.display == current.display
//         }).length == 0;
//     }
// }
exports.createMeetingString = (meetingSeetings) => {
    let meetingSettingsString = "";
    if (meetingSeetings.length) {
        for (let i = 0; i < meetingSeetings.length; i++) {
            let key = meetingSeetings[i].setting_name;
            let val = meetingSeetings[i].setting_value;
            meetingSettingsString += '&' + key + '=' + val;
        }
    }
    return meetingSettingsString;
}
exports.comparer = (list1, list2, isUnion) => {
    var result = [];

    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i],
            found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = "F" + item1.event_booth_id === list2[j].meetingID;
            if (found) {
                item1.participantCount = list2[j].participantCount;
            } else {
                item1.participantCount = 0;
            }
        }
        // if (found === !!isUnion) { // isUnion is coerced to boolean
        result.push(item1);
        // }
    }
    return result;
}
exports.comparerDate = (list1, list2, isUnion) => {

    for (var j = 0; j < list2.length; j++) {
        // let date = new Date(new Date(list2[j].date).getTime() + (ISTOffset + currentOffset) * 60000).getDate().toString();
        // let startTime = new Date(new Date(list2[j].date).getTime() + (ISTOffset + currentOffset) * 60000).getHours();
        // let endTime = new Date(new Date(list2[j].date_end).getTime() + (ISTOffset + currentOffset) * 60000).getHours();
        // list1 = list1.filter(dataList1 =>
        //     ((dataList1.getDate().toString() == date) && ((dataList1.getHours() >= + startTime) && (dataList1.getHours() <= + endTime))));
        let startDate = new Date(new Date(list2[j].date).getTime() + (ISTOffset + currentOffset) * 60000);
        let endDate = new Date(new Date(list2[j].date_end).getTime() + (ISTOffset + currentOffset) * 60000);
        list1 = list1.filter(dataList1 => {
            let timeNow = dataList1;
            if ((timeNow.getDate() == startDate.getDate()) && (timeNow.getTime() >= startDate.getTime() && timeNow.getTime() <= endDate.getTime())) {
                return false;
            } else {
                return true;
            }

        }
        )
    }
    list1 = list1.map(data => {
        data = moment(data).format("DD-MMM-YYYY HH:mm:ss");
        return data;
    })

    return list1;
}
exports.differenceInseconds = (startTime, endTime) => {
    var result = [];

    let duration = moment.duration(endTime.diff(startTime));
    return duration;
}
exports.isValidDateTimeFn = (data) => {
    let curDate = new Date();
    let eventDate = this.getDate(data.event_date);
    let startDate = new Date(eventDate + " " + data.start_time);
    let endDate = new Date(eventDate + " " + data.end_time);
    if (endDate >= curDate) {
        this.isEventCompleted = false;
    } else {
        this.isEventCompleted = true;

    }
    if ((startDate <= curDate) && (endDate >= curDate)) {
        return true;
    } else {
        return false
    }
}

exports.getDateArray = (startDate, endDate, addFn, interval) => {
    addFn = addFn || Date.prototype.addDays;
    interval = interval || 1;

    var retVal = [];
    var current = new Date(new Date(startDate.getTime() + (ISTOffset + currentOffset) * 60000).setHours(00, 00, 00));

    while (current <= endDate) {
        retVal.push(new Date(current.getTime() + (ISTOffset + currentOffset) * 60000));
        current = addFn.call(current, interval);
    }

    return retVal;
}
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
exports.isUuid = (id) => {
    var patt = new RegExp("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}");
    return patt.test(id);
}
exports.pdf2base64 = (file) => {
    return pdf2base64(file)
        .then(
            (response) => {
                return ({ status: 200, response: response }); //cGF0aC90by9maWxlLmpwZw==
            }
        )
        .catch(
            (error) => {
                return ({ status: 500, response: error });                //Exepection error....
            }
        )
}

exports.compareArrayObject = (otherArray) => {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.session_name == current.session_name
        }).length == 0;
    }
}

exports.objectToQueryString = (obj) => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
exports.simplyfyCrifPersonalInformation = (obj) => {
    let returnData = {};
    Object.keys(obj).forEach(function (item) {
        obj[item].forEach(element => {
            let keyName = item.toLowerCase().replace(new RegExp("-", 'g'), "_")
            if (!returnData[keyName]) {
                returnData[keyName] = [];
            }
            let response = { date: element['VARIATION']['REPORTED-DATE'], [keyName.replace("_variations", "")]: element['VARIATION']['VALUE'] };
            returnData[keyName].push(response);
        });
    });
    return returnData;
}
exports.simplyfyCrifLoans = (array) => {
    let finalArray = [];
    if (array && array.length) {


        array.forEach(function (data) {
            let pushObj = {};
            let obj = data['RESPONSE']['LOAN-DETAILS'];
            Object.keys(obj).forEach(item => {
                let value = "";
                let keyName = item.toLowerCase().replace(new RegExp("-", 'g'), "_")
                if (item == "SECURITY-DETAILS") {
                    value = simplifyLoanArrays(obj[item], "SECURITY-DETAIL");
                }
                else if (item == "LINKED-ACCOUNTS") {
                    value = simplifyLoanArrays(obj[item], "ACCOUNT-DETAILS");
                }
                else {
                    value = obj[item]
                }
                pushObj[keyName] = value;
            });
            finalArray.push(pushObj)
        });
    }
    return finalArray;
}
simplifyLoanArrays = (array, key) => {
    let finalArray = [];
    if (array && array.length) {

        array.forEach(function (data) {
            let pushObj = {};
            let obj = data[key];
            Object.keys(obj).forEach(item => {
                let keyName = item.toLowerCase().replace(new RegExp("-", 'g'), "_")
                pushObj[keyName] = obj[item];
            });
            finalArray.push(pushObj)
        });
    }
    return finalArray;
}
exports.simplifyArray = simplifyLoanArrays;
exports.simplyfyObject = (obj) => {
    let pushObj = {};
    Object.keys(obj).forEach(item => {
        let keyName = item.toLowerCase().replace(new RegExp("-", 'g'), "_")
        pushObj[keyName] = obj[item];
    });

    return pushObj;
}
exports.getMonthlyEmi = (string) => {
    let returnAmt = 0;
    if (string) {
        let arr = string.split("/");
        let amount = parseFloat(arr[0].replace(/,/g, '')); //to convert string number even  if it's comint comma separated
        let type = arr[1];
        switch (type) {
            case "Weekly":
                returnAmt = amount * 4;
                break;
            case "BiWeekly":
                returnAmt = amount * 2;
                break;
            case "Monthly":
                returnAmt = amount;
                break;
            case "Bimonthly":
                returnAmt = amount / 2;
                break;
            case "Quarterly":
                returnAmt = amount / 4;
                break;
            case "Semi annually":
                returnAmt = amount / 6;
                break;
            case "Annually":
                returnAmt = amount / 12;
                break;
            default:
                returnAmt = amount;
                break;
        }
    }

    return returnAmt;
}

exports.getUUID = () => {
    return uuidv4();
}
exports.IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
exports.convertToCSV = (objArray) => {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}
exports.onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}
exports.changeKeyName = (obj) => {
    const keyExists = (obj) => {
        if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
            return false;
        }
        if (Array.isArray(obj)) {

            for (let i = 0; i < obj.length; i++) {
                const result = keyExists(obj[i]);
            }
        }
        else {
            for (const k in obj) {
                obj[k.split('-').join('_')] = obj[k];
                keyExists(obj[k.split('-').join('_')]);
            }
        }
    };

    keyExists(obj);
    return obj;
}
exports.daysDiff = (date) => {
    // Parse the input date using Moment.js
    const inputDate = moment(date);

    // Calculate the difference in days between the input date and the current date
    const differenceInDays = moment().diff(inputDate, 'days');

    // Return true if the difference is greater than 30 days, otherwise false
    return differenceInDays;
}
exports.pdfCreationPromise=(template,pdfFile,options) => new Promise((resolve, reject) => {
    pdf.create(template, options).toFile(pdfFile, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(pdfFile);
        }
    });
});