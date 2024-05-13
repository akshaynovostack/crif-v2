const { fetchReport, generateReport } = require("../../../helpers/bureauHelper.js");
const { getUUID, daysDiff } = require("../../../helpers/commonhelper.js");
const { crifCustomerId, crifProductId, activeBureauPartner, bureauStatus, crifStatus } = require("../../../helpers/constantdata/config.js");
const { getAccessCode } = require("../../../helpers/crif/auth.js");
const { catchError } = require("../../../helpers/error/axios.js");
const { apiResponse } = require("../../../helpers/response/response.js");
const { getUserDetailsWithBureau } = require("../../../models/customers.js");
const { initiate, response } = require("../../../services/crifService.js");
const moment = require("moment");
const { insertCustomerBureau, updateBureauDataByCustomerIdAndVendor, deleteConsentByCustomerIdAndVendor } = require("../../../services/customerBureauService.js");
const { logger } = require("../../../helpers/logger/index.js");
const { insertCustomerConsent } = require("../../../services/customerConsentsService.js");
const ResHelper = require(_pathconst.FilesPath.ResHelper);

exports.getReport = async (req, res, next) => {
    try {
        let { customer_id, consent, user_answer, refresh_report } = req.body;
        logger.log({ level: 'info', message: { type: "crif_fetch_report", data: req.body } });

        let hasConsent = 0;

        if (consent == "Y") {
            hasConsent == 1
        } else {
            return ResHelper.apiResponse(res, false, "Please provide the consent", 400, { status: 'failed', data: {} }, "");

        }
        let orderId = "Novo" + new Date().getTime();
        let bureauId = getUUID();
        const user = await getUserDetailsWithBureau(customer_id, activeBureauPartner); //to fetch the customer data with active bureau partner

        if (user) {
            let accessCode = getAccessCode()
            //destructure the data according to the crif 
            let { permanent_account_number, first_name, middle_name, last_name, father_first_name, father_middle_name, father_last_name, father_full_name, date_of_birth, customer_mobile_number, email_address, address_house_number, address_building, address_area, address_city, address_state, address_pincode, gender, customer_bureaus, customer_addresses } = user;
            let father_name = (father_first_name || "") + ' ' + (father_middle_name || "") + ' ' + (father_last_name || "");
            let dob = moment(date_of_birth).format("DD-MM-YYYY");
            let address_1 = address_house_number + ' ' + address_building;
            let village_1 = address_area;
            let city_1 = address_city;
            let state_1 = address_state;
            let pin_1 = address_pincode;
            let country_1 = "India";

            if (customer_addresses && customer_addresses.length) {
                let permanentAdresses = customer_addresses.find(e => e.address_type_id == 'permanent_address');
                permanentAdresses = permanentAdresses || customer_addresses[0];
                let { address_line_1, address_line_2, address_line_3, pin_code, city, state } = permanentAdresses;
                if (Object.keys(permanentAdresses).length) {//Modify new addressstreet
                    address_1 = (address_line_1 + " " + address_line_2) || address_1
                    village_1 = address_line_3 || village_1;
                    city_1 = city || city_1;
                    state_1 = state || state_1;
                    pin_1 = pin_code || pin1;
                }

            };
            //destructure the data according to the crif end here

            let bureau_data = {};
            if (customer_bureaus && customer_bureaus.length) {

                bureau_data = customer_bureaus[0]; //to get the active vendor data
                let diffDays = daysDiff(bureau_data.created_at)
                let hasExpired = diffDays > 30 ? true : false; //if the days diff is grater than  30 days

                if (bureau_data && hasExpired && refresh_report) { //If the report is expired or 
                    bureau_data = {
                        customer_id, vendor: activeBureauPartner, order_id: orderId, status: bureauStatus['pending'], access_code: accessCode, report_id: '', credit_score: "", outstanding_obligations: "", monthly_obligations: "", report_xml: "", report_url: "", consent: hasConsent
                    }
                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, bureau_data)
                } else if (bureau_data && bureau_data.status == bureauStatus['report_generated']) {
                    return ResHelper.apiResponse(res, true, "Success", 200, { status: 'report_generated', refresh_enable: hasExpired ? true : false, created_at: bureau_data.created_at, data: bureau_data.report_data }, "");
                }
            } else {
                bureau_data = {
                    bureau_id: bureauId, customer_id, vendor: activeBureauPartner, order_id: orderId, status: bureauStatus['pending'], access_code: accessCode, report_id: '', credit_score: "", outstanding_obligations: "", monthly_obligations: "", report_xml: "", report_url: "", consent: hasConsent
                }
                await insertCustomerBureau(bureau_data);//Insert new bureau data
            }
            await insertCustomerConsent({ customer_id, service_type: 'bureau', consent_type: 'crif_fetch_report', description: "Consent given by customer" })

            let dataString = `${first_name ? first_name : ""}|${middle_name ? middle_name : ""}|${last_name ? last_name : ""}|${gender || ""}|${dob}|||${customer_mobile_number}|||${email_address}||${permanent_account_number ? permanent_account_number : ""}||||||||${father_name || ""}|||${address_1}|${village_1}|${city_1}|${state_1}|${pin_1}|${country_1}|||||||${crifCustomerId}|${crifProductId}|${consent}|`; //This is the data string we need to send to crif
            let initiateOrder = await initiate(dataString, orderId, accessCode); //Initiate the orde at crif end


            if (initiateOrder.status == 200) {

                const { reportId, orderId, status } = initiateOrder.data;
                await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { order_id: orderId, status: bureauStatus['initiated'], access_code: accessCode, report_id: '' })//Update the status

                if (!orderId) {
                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { order_id: orderId, status: bureauStatus['failed'], access_code: accessCode, report_id: reportId })//Update the status ;
                    return ResHelper.apiResponse(res, false, "Kindly initiate the transaction again.", 403, { status: 'failed', data: initiateOrder.data }, "")
                }; // If no transaction found

                await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { report_id: reportId, status: bureauStatus['authenticated'] }); //Set the status as initiated and save the report id 

                if (status == "S08") {//If tech error from crif
                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['failed'] }); //Set the status as initiated and save the report id 
                    return ResHelper.apiResponse(res, false, crifStatus[status], 403, { status: 'failed', data: initiateOrder.data }, "");
                }// Request is accepted by Bureau
                if (status !== "S06") { return ResHelper.apiResponse(res, false, crifStatus[status], 403, { status: 'authenticated', data: initiateOrder.data }, ""); }// Request is accepted by Bureau


                let step1 = await fetchReport(orderId, user_answer, false, reportId, accessCode);

                let { status: statusStep1, data: dataStep1 } = step1;

                let { status: statusCodeStep1 } = dataStep1;

                if (statusStep1 !== 200) {
                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['failed'] }); //Set the status as initiated and save the report id 
                    return ResHelper.apiResponse(res, false, crifStatus[statusCodeStep1], 403, { status: 'failed', data: dataStep1 }, "");
                }//Return if got any error with the response

                if (statusCodeStep1 == "S11") {//If it's authentication phase

                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['questionnaire'] }); //If the user’s answer sent in request is incorrect
                    return ResHelper.apiResponse(res, true, crifStatus[statusCodeStep1], 201, { status: 'questionnaire', data: dataStep1 }, "")

                } else if (statusCodeStep1 == "S09") {//Auth Fail

                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['failed'] }); //all questions answered incorrectly
                    return ResHelper.apiResponse(res, true, crifStatus[statusCodeStep1], 201, { status: 'no_hit', data: dataStep1 }, "")

                } else if (statusCodeStep1 == "S02") {//Auth Fail

                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['failed'] }); //all questions answered incorrectly
                    return ResHelper.apiResponse(res, true, crifStatus[statusCodeStep1], 403, { status: 'failed', data: dataStep1 }, "")

                } else if (statusCodeStep1 == "S01" || statusCodeStep1 == "S10") {//If the authentication has been completed
                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { status: bureauStatus['questionnaire_success'] }); //Auto Authentication – Confident match from Bureau.

                    let step2 = await fetchReport(orderId, user_answer, true, reportId, accessCode);

                    let finalData = await generateReport(step2, permanent_account_number);//to get the report and desctruct the data
                    let { credit_score, monthly_obligations, outstanding_obligations } = finalData.meta_data || {}

                    await updateBureauDataByCustomerIdAndVendor(activeBureauPartner, customer_id, { report_data: finalData, credit_score: String(credit_score), monthly_obligations: String(monthly_obligations), outstanding_obligations: String(outstanding_obligations), report_url: finalData?.report_url, status: bureauStatus['report_generated'], created_at: new Date().toISOString() }); //Auto Authentication – Confident match from Bureau.

                    return ResHelper.apiResponse(res, true, "Success", 200, { status: 'report_generated', refresh_enable: false, created_at: new Date().toISOString(), data: finalData }, "");

                } else {
                    return ResHelper.apiResponse(res, false, crifStatus[statusCodeStep1], 403, { status: 'failed', data: dataStep1 }, "");//Return if got any error with the response
                }

            } else {
                return ResHelper.apiResponse(res, false, "Unable to  process with this request.", 403, { status: 'failed', data: initiateOrder.data }, ""); // If no transaction found
            }
        } else {
            return ResHelper.apiResponse(res, false, "No record found for this user.", 401, { status: 'failed', data: {} }, "");
        }
    }
    catch (e) {
        let data = catchError(e);
        logger.log({ level: 'error', message: data });
        apiResponse(res, false, data.message, data.status, { status: 'failed', data: data.data || {} }, "");
    }
}
exports.withDrawConsent = async (req, res, next) => {
    try {
        let { customer_id } = req.params;
        logger.log({ level: 'info', message: { type: "crif_consent_withdraw", customer_id } });

        let deleteCount = await deleteConsentByCustomerIdAndVendor(activeBureauPartner, customer_id)
        console.log(deleteCount);
        return ResHelper.apiResponse(res, true, deleteCount ? "Success" : "No bureau data found for this customer", 200, {}, "");

    }
    catch (e) {
        let data = catchError(e);
        logger.log({ level: 'error', message: data });
        apiResponse(res, false, data.message, data.status, { status: 'failed', data: data.data || {} }, "");
    }
}
