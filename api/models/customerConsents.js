const { Model } = require('objection');

class CustomerConsents extends Model {
    static get tableName() {
        return 'ru_customer_consents';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'service_type', 'consent_type'],
            properties: {
                id: { type: 'integer' },
                user_type: { type: 'string', enum: ['customer', 'dsa'] }, // Enum definition
                user_id: { type: 'string', maxLength: 50 },
                service_type: { type: 'string', maxLength: 100 },
                consent_type: { type: 'string' },
                description: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }
}

module.exports = CustomerConsents;
