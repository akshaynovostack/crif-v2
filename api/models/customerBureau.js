// customerBureau.js
const { Model } = require('objection');
const { Customer } = require('./customers');
Model.knex(knexSqlDb);

class CustomerBureau extends Model {
    static get tableName() {
        return 'ru_customer_bureau';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['bureau_id', 'customer_id'],
            properties: {
                id: { type: 'integer' },
                bureau_id: { type: 'string', maxLength: 50 },
                customer_id: { type: 'string', maxLength: 50 },
                vendor: { type: 'string', maxLength: 50 },
                order_id: { type: 'string', maxLength: 50 },
                report_id: { type: 'string', maxLength: 50 },
                access_code: { type: 'string', maxLength: 1000 },
                credit_score: { type: 'string', maxLength: 50 },
                outstanding_obligations: { type: 'string', maxLength: 50 },
                monthly_obligations: { type: 'string', maxLength: 50 },
                report_xml: { type: 'string' }, //  report_xml is a string
                report_data: { type: 'object' }, // You can specify JSON schema for the JSON field
                report_url: { type: 'string' }, //report_url is a string
                status: { type: 'integer' }, //  status is a string enum
                consent: { type: 'integer' }, //  status is a string enum
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }
    static get relationMappings() {
        return {
            customer: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: 'ru_customer_bureau.customer_id',
                    to: 'ru_customers.customer_id'
                }
            }
        };
    }
    
}

module.exports = CustomerBureau;
