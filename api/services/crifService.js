const axios = require("axios");
const { crifBaseUrl, crifAppId, crifCustomerId } = require("../helpers/constantdata/config");

const initiate = (data, orderId, accessCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      let headers = {
        orderId, accessCode, 'appID': crifAppId,
        'merchantID': crifCustomerId,
        'Content-Type': 'text/plain'
      }
      // console.log("<<<<<<<<<<<<<<<<<")
      // console.log("url=> ", crifBaseUrl + `initiate`)
      // console.log("headers=> ", headers)
      // console.log("req=> ", data)
      let responseData = await axios.request({
        method: "post",
        url: crifBaseUrl + `initiate`,
        data,
        headers
      });

      // console.log("response=> ", responseData.data)
      // console.log(">>>>>>>>>>>>>>>>>>")
      resolve(responseData)
    } catch (err) {
      reject(err);
    }
  });
};

const response = (data, orderId, reportId, accessCode, isAuthorized) => {
  return new Promise(async (resolve, reject) => {
    try {
      let headers = {
        orderId,
        accessCode,
        'appID': crifAppId,
        'merchantID': crifCustomerId,
        reportId,
        'Accept': 'application/xml',
        'Content-Type': 'text/plain',
        // 'requestType': 'Authorization',
      }
      if (!isAuthorized) {
        headers.requestType = 'Authorization'
      }
      // console.log("<<<<<<<<<<<<<<<<<")
      // console.log("url=> ", crifBaseUrl + `response`)
      // console.log("headers=> ", headers)
      // console.log("req=> ", data)
      let responseData = await axios.request({
        method: "post",
        url: crifBaseUrl + `response`,
        data,
        headers
      });

      // console.log("response=> ", responseData.data)
      // console.log(">>>>>>>>>>>>>>>>>>")

      resolve(responseData)
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  initiate,
  response
};
