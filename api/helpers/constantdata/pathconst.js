exports.PagesPath = {
  IndexPage: appRoot + "/api/index.html",
  ErrorPage: appRoot + "/api/error.html",
  DocPage: appRoot + "/api/doc/index.html"
};
exports.ControllersPath = {
  UserControllerV1: appRoot + '/api/v1/controllers/user/index.js',
  VerificationControllerV1: appRoot + '/api/v1/controllers//e-kyc/verification/index.js'
};

exports.FilesPath = {
  V1Routes: appRoot + "/api/v1/routes/index.js",
  DBContaxt: appRoot + "/api/lib/mysql.js",
  Encryption: appRoot + "/api/helpers/crypto/Encryption.js",
  ConfigUrl: appRoot + "/api/helpers/constantdata/config.js",
  DBsetting: appRoot + "/api/helpers/constantdata/dbSetting.js",
  AuthHelper: appRoot + "/api/helpers/constantdata/authhelper.js",
  NotificationHelper: appRoot + "/api/helpers/notification/Notification.js",
  QueueHelper: appRoot + "/api/helpers/queue/Awssqs.js",
  EmailHelper: appRoot + "/api/helpers/email/email.js",
  EmailHelperNew: appRoot + "/api/helpers/email/emailSession.js",
  EmailTempelate: appRoot + "/api/helpers/email/emailTempelate.js",
  ResHelper: appRoot + "/api/helpers/response/response.js",
  TextLocalHelper: appRoot + "/api/helpers/textlocal/TextLocal.js",
  CommonHelper: appRoot + "/api/helpers/commonhelper.js",
  APIHelper: appRoot + "/api/helpers/apihelper.js",
  UploadFileS3: appRoot + "/api/helpers/upload/s3Upload.js",
  ConstantValues: appRoot + "/api/helpers/constantdata/constantvalues.js",
  BitlyHelper: appRoot + "/api/helpers/url-shortner/bitly.js",
  CustomHelper: appRoot + "/api/helpers/url-shortner/custom.js",
  PdfTemplateForCreditReport: appRoot+ "/pdfTemplateForCreditReport.ejs"
};

exports.ReqModelsPath = {
  UserModelV1: appRoot + "/api/v1/models/user/index.js",
};

exports.ServicesPath = {
  UserService: appRoot + "/api/services/user-services.js",
  PanService: appRoot + "/api/services/pan-services.js",
}