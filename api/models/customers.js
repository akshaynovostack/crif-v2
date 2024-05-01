const { Model } = require('objection');
const Knex = require('knex');
const CustomerBureau = require('./customerBureau');
const CustomerAddress = require('./customersAddress');
Model.knex(knexSqlDb);

// 5. Define the Customer model:
class Customer extends Model {
    static get tableName() {
        return 'ru_customers';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['dsa_mobile_number', 'customer_id', 'dsa_id', 'customer_mobile_number', 'full_name', 'is_mobile_number_verified', 'created_at', 'updated_at'],
            properties: {
                id: { type: 'bigint' },
                dsa_mobile_number: { type: 'string', maxLength: 191 },
                customer_id: { type: 'string', maxLength: 191 },
                dsa_id: { type: 'string', maxLength: 191 },
                customer_mobile_number: { type: 'string', maxLength: 191 },
                salutation: { type: 'string', maxLength: 191 },
                first_name: { type: 'string', maxLength: 191 },
                middle_name: { type: 'string', maxLength: 191 },
                last_name: { type: 'string', maxLength: 191 },
                full_name: { type: 'string', maxLength: 191 },
                father_first_name: { type: 'string', maxLength: 191 },
                father_middle_name: { type: 'string', maxLength: 191 },
                father_last_name: { type: 'string', maxLength: 191 },
                father_full_name: { type: 'string', maxLength: 191 },
                mother_first_name: { type: 'string', maxLength: 191 },
                mother_middle_name: { type: 'string', maxLength: 191 },
                mother_last_name: { type: 'string', maxLength: 191 },
                mother_full_name: { type: 'string', maxLength: 191 },
                is_mobile_number_verified: { type: 'integer' },
                email_address: { type: 'string', maxLength: 191 },
                date_of_birth: { type: 'string', maxLength: 191 },
                age: { type: 'string', maxLength: 191 },
                gender: { type: 'string', maxLength: 191 },
                permanent_account_number: { type: 'string', maxLength: 191 },
                address_house_number: { type: 'string', maxLength: 191 },
                address_building: { type: 'string', maxLength: 191 },
                address_area: { type: 'string', maxLength: 191 },
                address_city: { type: 'string', maxLength: 191 },
                address_state: { type: 'string', maxLength: 191 },
                address_pincode: { type: 'string', maxLength: 191 },
                office_address_house_number: { type: 'string', maxLength: 191 },
                office_address_building: { type: 'string', maxLength: 191 },
                office_address_area: { type: 'string', maxLength: 191 },
                office_address_city: { type: 'string', maxLength: 191 },
                office_address_state: { type: 'string', maxLength: 191 },
                office_address_pincode: { type: 'string', maxLength: 191 },
                communication_address: { type: 'string', maxLength: 191 },
                customer_created_date: { type: 'string', maxLength: 191 },
                profession_type: { type: 'string', maxLength: 45 },
                marital_status: { type: 'string', maxLength: 45 },
                company_name: { type: 'string' }, // Assuming longtext is equivalent to text
                designation: { type: 'string', maxLength: 45 },
                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' },
                password_hash: { type: 'string', maxLength: 191 },
                google_id: { type: 'string', maxLength: 150 },
                facebook_id: { type: 'string', maxLength: 150 },
                source_from: { type: 'integer' }
            }
        };
    }
    static get relationMappings() {
        return {
            customer_bureaus: {
                relation: Model.HasManyRelation,
                modelClass: CustomerBureau,
                join: {
                    from: 'ru_customers.customer_id',
                    to: 'ru_customer_bureau.customer_id'
                }
            },
            customer_addresses:{
                relation: Model.HasManyRelation,
                modelClass: CustomerAddress,
                join: {
                    from: 'ru_customers.customer_id',
                    to: 'ru_customer_addresses.customer_id'
                }
            }
        };
    }
}

// 6. Export the Customer model:

async function getUserDetailsWithBureau(customerId, vendor) {
    try {
        const userDetails = await Customer.query()
            .findOne({ customer_id: customerId })
            .select('gender', 'permanent_account_number', 'first_name', 'middle_name', 'last_name',
                'father_first_name', 'father_middle_name', 'father_last_name', 'father_full_name','date_of_birth',
                'customer_mobile_number', 'email_address', 'address_house_number', 'address_building',
                'address_area', 'address_city', 'address_state', 'address_pincode').withGraphFetched('[customer_bureaus,customer_addresses]').modifyGraph('customer_bureaus', builder => {
                    builder.where('vendor', vendor);
                });;
        ;

        return userDetails;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}

module.exports = { Customer, getUserDetailsWithBureau };
