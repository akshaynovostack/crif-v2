var AWS = require("aws-sdk");
var Config = require(_pathconst.FilesPath.ConfigUrl);
var CommonHelper = require(_pathconst.FilesPath.CommonHelper);
const CommonController = require(_pathconst.ControllersPath.CommonController)
var nodeSes = require('node-ses');
var client = nodeSes.createClient({ key: Config.accessKeyId, secret: Config.secretAccessKey });
var CRLF = '\r\n';
var ses = new AWS.SES({
  apiVersion: Config.apiVersion,
  accessKeyId: Config.accessKeyId,
  secretAccessKey: Config.secretAccessKey,
  sslEnabled: true,
  region: Config.region
});
const fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var utf8 = require('utf8');



exports.sendShortlistedEmail = async (studentEmail, emailTemplate, emailName, subject, UsersEmail, data) => {
  try {

    if (!data.length) {

      const params = {
        Source: `${emailName} <bot@yourdomain.com > `,
        Destination: {
          ToAddresses:
            studentEmail,
          CcAddresses:
            backendUsersEmail,

        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `${emailTemplate} `
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject ? subject : "From the team of Your Domain"
          }
        }
      }
      const emailPromise = await ses.sendEmail(params).promise();
      if (emailPromise.err) {
        return 'Some error occured'
      }
      else {
        return emailPromise;
      }
    } else {
      const filePath = await CommonController.createCSVForSchools(data);
      const contents = fs.readFileSync(filePath, { encoding: 'base64' });//convet to base64
      const encodedData = utf8.encode(emailTemplate);
      // console.log(encodedData)
      rawMessage = [
        `From: ${emailName} <bot@yourdomain.com>`,
        `To: ${studentEmail}`,
        `CC: ${UsersEmail}`,
        `Subject: ${subject}`,
        'Content-Type: multipart/mixed;',
        '    boundary="_003_97DCB304C5294779BEBCFC8357FCC4D2"',
        'MIME-Version: 1.0',
        '',
        '--_003_97DCB304C5294779BEBCFC8357FCC4D2',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: quoted-printable',
        `${encodedData}`,
        '',
        '--_003_97DCB304C5294779BEBCFC8357FCC4D2',
        'Content-Type: text/plain; name="code.txt"',
        'Content-Description: code.txt',
        'Content-Disposition: attachment; filename="Schools.csv"; size=4;',
        '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
        '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
        'Content-Transfer-Encoding: base64',
        '',
        `${contents}`,
        '',
        '--_003_97DCB304C5294779BEBCFC8357FCC4D2',
        ''
      ].join(CRLF);
      client.sendRawEmail({
        from: `${emailName} < bot@yourdomain.com > `,
        rawMessage: rawMessage
      }, function (err, data, res) {
        if (err) {
          console.log(err);
          return 'Some error occured'
        } else {
          fs.unlinkSync(filePath)
          // console.log(data);
          return data;
        }
        // ...
      });
    }
  }
  catch (e) {
    console.log(e);
  }
}