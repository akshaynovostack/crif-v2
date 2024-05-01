
const { simplyfyCrifPersonalInformation, simplyfyCrifLoans, simplyfyObject, simplifyArray, getMonthlyEmi, IsJsonString, convertToCSV, onlyUnique, changeKeyName,  isDateGreaterThan30Days, pdf2base64, uploadToS3, getUUID, pdfCreationPromise } = require("./commonhelper");
let ejs = require("ejs");
let fs = require("fs");
const { response } = require("../services/crifService");
const { crifReturnUrl } = require("./constantdata/config");
const moment = require("moment");

exports.getCreditReportPdf = async (CreditReport, pan) => {
    let data = CreditReport;
    if (data.B2C_REPORT.RESPONSES) {
        for (let i = 0; i < data.B2C_REPORT.RESPONSES.length; i++) {
            let temp = {};
            let singleResponse = data.B2C_REPORT.RESPONSES[i];
            if (singleResponse.RESPONSE.LOAN_DETAILS.COMBINED_PAYMENT_HISTORY) {
                let recordArray = singleResponse.RESPONSE.LOAN_DETAILS.COMBINED_PAYMENT_HISTORY.split('|');
                for (let j = 0; j < recordArray.length - 1; j++) {
                    let recordData = recordArray[j].split(',')[1];
                    let recordYear = recordArray[j].split(',')[0].split(':')[1];
                    let recordMonth = recordArray[j].split(',')[0].split(':')[0];
                    if (temp.hasOwnProperty(recordYear)) {
                        temp[recordYear][recordMonth] = recordData;
                    } else {
                        temp[recordYear] = {
                            "Jan": "",
                            "Feb": "",
                            "Mar": "",
                            "Apr": "",
                            "May": "",
                            "Jun": "",
                            "Jul": "",
                            "Aug": "",
                            "Sep": "",
                            "Oct": "",
                            "Nov": "",
                            "Dec": ""
                        };
                        temp[recordYear][recordMonth] = recordData;
                    }
                }
            }
            data.B2C_REPORT.RESPONSES[i].RESPONSE.LOAN_DETAILS.COMBINED_PAYMENT_FORMATTED = temp;
        }
    }

    try {
        const template = await ejs.renderFile(_pathconst.FilesPath.PdfTemplateForCreditReport, { data: CreditReport });
        const options = {
            "height": "3200px",
            "width": "1200px",
            "format": "A4"
        };

        const pdfFile = appRoot + `/${pan}_report.pdf`;

  

        const generatedPdf = await pdfCreationPromise(template,pdfFile,options,);
        const bs64 = await pdf2base64(generatedPdf);
        const uniqueString = getUUID();

        // Uploading to S3
        const url = await uploadToS3("credit_score_report", bs64.response, uniqueString, 'application/pdf', 'pdf');

        // Clean up the generated PDF
        await fs.unlink(generatedPdf,((err => {
            if (err) console.log(err);
            else {
                console.log(`\nDeleted file: ${generatedPdf}`);
            }
        })));

        return url;
    } catch (error) {
        throw error;
    }
};
 


exports.fetchReport = async (order_id, user_answer, is_authorized, report_id, access_code) => {
    try {


        let alert_flag = "N", payment_flag = "N", report_flag = "Y";//define the flag here

        let dataString = `${order_id}|${report_id}|${access_code}|${crifReturnUrl}|${payment_flag}|${alert_flag}|${report_flag}|${is_authorized ? "Y" : user_answer}`;//Genrate the data string for the report
        let responseOrder = await response(dataString, order_id, report_id, access_code, is_authorized);
        return responseOrder;
    } catch (error) {
        throw error;
    }

}



exports.generateReport = async (responseOrder, panNumber) => {
    let finalData = {}
    let personalInformation = { ...simplyfyObject(responseOrder.data['B2C-REPORT']['REQUEST']), ...simplyfyCrifPersonalInformation(responseOrder.data['B2C-REPORT']['PERSONAL-INFO-VARIATION']) };
    let loans = simplyfyCrifLoans(responseOrder.data['B2C-REPORT']['RESPONSES']);
    let monthly_obligations = 0;
    loans = loans.map(e => {
        let { account_status, disbursed_dt, closed_date, credit_limit } = e;
        if (account_status == "Active") {
            e.tenure = moment(new Date(), "DD-MM-YYYY").diff(moment(disbursed_dt, "DD-MM-YYYY"), 'months');
        } else {
            e.tenure = moment(closed_date, "DD-MM-YYYY").diff(moment(disbursed_dt, "DD-MM-YYYY"), 'months');
        }

        if (e.installment_amt) {
            e.monthly_emi = getMonthlyEmi(e.installment_amt);
        } else {
            e.monthly_emi = 0;
        }
        if (account_status == "Active") {
            monthly_obligations += e.monthly_emi;

            e.tenure = (e.tenure > 1) ? e.tenure : 0;
        }
        e.monthly_limit = credit_limit;

        return e;
    })
    let accountSummary = ({
        ...simplyfyObject(responseOrder.data['B2C-REPORT']['ACCOUNTS-SUMMARY']['DERIVED-ATTRIBUTES']),
        ...simplyfyObject(responseOrder.data['B2C-REPORT']['ACCOUNTS-SUMMARY']['PRIMARY-ACCOUNTS-SUMMARY']),
        ...simplyfyObject(responseOrder.data['B2C-REPORT']['ACCOUNTS-SUMMARY']['SECONDARY-ACCOUNTS-SUMMARY'])
    });
    let scores = simplifyArray(responseOrder.data['B2C-REPORT']['SCORES'], 'SCORE');
    let inquiryHistory = simplifyArray(responseOrder.data['B2C-REPORT']['INQUIRY-HISTORY'], 'HISTORY');
    let employmentDetails = simplifyArray(responseOrder.data['B2C-REPORT']['EMPLOYMENT-DETAILS'], 'EMPLOYMENT-DETAIL');
    let meta_data = {};

    //Prepare meta data
    meta_data.active_credit_cards = (loans.filter(d => (d.acct_type.toLowerCase().replace(new RegExp("", 'g'), "") == "Credit Card".toLowerCase().replace(new RegExp("", 'g'), "")) && d.account_status == "Active")).length; //Find active credit card
    meta_data.active_loans = (loans.filter(d => (d.acct_type.toLowerCase().replace(new RegExp("", 'g'), "") != "Credit Card".toLowerCase().replace(new RegExp("", 'g'), "")) && d.account_status == "Active")).length; //Find active Loans
    meta_data.outstanding_obligations = accountSummary.primary_current_balance ? accountSummary.primary_current_balance : 0; //Find total obligations
    meta_data.monthly_obligations = monthly_obligations; //Find monthly current balance
    let score = scores.find(e => e.score_type == "PERFORM CONSUMER 2.0");
    meta_data.credit_score = score ? score.score_value : 0; //credit score of the user
    meta_data.loans = (loans.filter(d => (d.acct_type.toLowerCase().replace(new RegExp("", 'g'), "") != "Credit Card".toLowerCase().replace(new RegExp("", 'g'), ""))));//Loans of the user

    //To update the credit card data
    let cc = (loans.filter(d => (d.acct_type.toLowerCase().replace(new RegExp("", 'g'), "") == "Credit Card".toLowerCase().replace(new RegExp("", 'g'), ""))));

    meta_data.credit_cards = cc;
    //update the credit card data
    
    //Prepare meta data

    //Structurized json response
    let reports = changeKeyName(responseOrder.data)
    
    let report_url = await this.getCreditReportPdf({ B2C_REPORT: reports.B2C_REPORT }, panNumber);

    
    finalData = { meta_data, personal_info: personalInformation, loans, account_summary: accountSummary, scores, inquiry_history: inquiryHistory, employment_details: employmentDetails, report_url }
    return finalData
} 