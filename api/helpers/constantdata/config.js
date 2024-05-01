let environment = process.env.ENV ? process.env.ENV : "development";
exports.TOKEN_SECRET = process.env.TOKEN_SECRET;//sample secret  "LowRate!@#$%^&*()";


exports.AES_KEY = process.env.AES_KEY ? process.env.AES_KEY : "testing"; // sample key "a263c18cbf76651ca99286b7ccb335c38fd26ba54b2956a0cd05906c03b0d9be";
exports.SERVER_KEY = process.env.SERVER_KEY; // sample key "a263c18cbf76651ca99286b7ccb335c38fd26ba54b2956a0cd05906c03b0d9be";

exports.apiVersion = process.env.AWS_API_VERSION;
exports.accessKeyId = process.env.AWS_ACCESS_KEY;
exports.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
exports.sslEnabled = true;
exports.regionEast = 'us-east-1';
exports.regionSouth = 'ap-south-1'

exports.s3apiVersion = process.env.S3_API_VERSION;
exports.s3accessKeyId = process.env.S3_ACCESS_KEY;
exports.s3secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

exports.bitlyAccessToken = process.env.BITLY_ACCESS_TOKEN;
exports.customShortnerBasePath = process.env.CUSTOMER_SHORTNER_BASE_PATH;
exports.customShortnerApiKey = process.env.CUSTOMER_SHORTNER_API_KEY;


exports.falseSightApiKey = process.env.FALSE_SIGHT_API_KEY ? process.env.FALSE_SIGHT_API_KEY : "kjbasdbakdb";
exports.falseSightApiUrl = process.env.FALSE_SIGHT_BASE_URL ? process.env.FALSE_SIGHT_BASE_URL : "https://falsesight.com/api/";

exports.environment = environment;

exports.activeBureauPartner = process.env.ACTIVE_BUREAU_PARTNER ? process.env.ACTIVE_BUREAU_PARTNER : "crif";
exports.crifBaseUrl = process.env.CRIF_BASE_URL ? process.env.CRIF_BASE_URL : "https://test.crifhighmark.com/Inquiry/do.getSecureService/DTC/";
exports.crifProductId = process.env.CRIF_PRODUCT_ID ? process.env.CRIF_PRODUCT_ID : "BBC_CONSUMER_SCORE#85#2.0";
exports.crifUserId = process.env.CRIF_USER_ID ? process.env.CRIF_USER_ID : "chm_bbc_UAT@ruloans.com";
exports.crifPassword = process.env.CRIF_PASSWORD ? process.env.CRIF_PASSWORD : "763195702B6DA0BDE2CAA4982BD7124BB51703BB";
exports.crifCustomerId = process.env.CRIF_CUSTOMER_ID ? process.env.CRIF_CUSTOMER_ID : "DTC0000315";
exports.crifCustomerName = process.env.CRIF_CUSTOMER_NAME ? process.env.CRIF_CUSTOMER_NAME : "RULOANS DISTRIBUTION SERVICES PRIVA LIMITED";
exports.crifAppId = process.env.CRIF_APP_ID ? process.env.CRIF_APP_ID : "r4^$E9?*V7T^fy#*g^&F!@a1&";
exports.crifReturnUrl = environment == "development" ? "https://cir.crifhighmark.com/Inquiry/B2B/secureService.action" : "https://cir.crifhighmark.com/Inquiry/B2B/secureService.action";
exports.roles = {
      1: "User"
}
exports.bureauStatus = {//Don't Change them without my permission akshay.sharma@novostack.com
      "failed": 0,
      "pending": 1,
      "initiated": 2,
      "authenticated": 3,
      "questinare": 4,
      "questinare_success": 5,
      "report_generated": 6
}
exports.crifStatus = {
      "S00": "Any Transaction Error in inquiry",
      "S01": "User Authentication Successful",
      "S02": "User Authentication Failure",
      "S03": "User Cancelled the Transaction",
      "S04": "Authorization for the report ID: not complete",
      "S05": "User Validations Failure",
      "S06": "Request is accepted by Bureau",
      "S07": "Error in request format",
      "S08": "Technical Error",
      "S09": "No HIT",
      "S10": "Auto Authentication – Confident match from Bureau.",
      "S11": "Authentication Questionnaire phase",

}