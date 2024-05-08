const customerConsents = require("../models/customerConsents");


async function insertCustomerConsent(data) {
    try {
        const newRecord = await customerConsents.query().insert(data);
        return newRecord;
    } catch (error) {
        console.error('Error inserting customer bureau record:', error);
        throw error;
    }
}


module.exports = { insertCustomerConsent};