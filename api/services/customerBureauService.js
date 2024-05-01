const CustomerBureau = require("../models/customerBureau");


async function insertCustomerBureau(data) {
    try {
        const newRecord = await CustomerBureau.query().insert(data);
        return newRecord;
    } catch (error) {
        console.error('Error inserting customer bureau record:', error);
        throw error;
    }
}

async function updateBureauDataByCustomerIdAndVendor(vendor, customerId, newData) {
    try {
        newData['updated_at'] = new Date().toISOString();//to update to current date and time

        // Update bureau records associated with the customer ID and vendor
        console.log(customerId, vendor);
        const updatedRecords = await CustomerBureau.query()
            .where('customer_id', customerId)
            .where('vendor', vendor)
            .patch(newData)
            .returning('*');

        return updatedRecords;
    } catch (error) {
        console.error('Error updating bureau data by customer ID and vendor:', error);
        throw error;
    }
}

module.exports = { insertCustomerBureau, updateBureauDataByCustomerIdAndVendor };