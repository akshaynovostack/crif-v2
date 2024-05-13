const { Model } = require('objection');
const { Customer } = require('./customers');
Model.knex(knexSqlDb);

// 5. Define the Customer model:

class CustomerAddress extends Model {
    static get tableName() {
      return 'ru_customer_addresses';
    }
  
    static get jsonSchema() {
      return {
        type: 'object',
        required: ['customer_id', 'customer_mobile_number', 'address_type_id', 'address_line_1', 'pin_code', 'city', 'state', 'country'],
        properties: {
          id: { type: 'integer' },
          customer_id: { type: 'string', minLength: 36, maxLength: 36 },
          customer_mobile_number: { type: 'string', maxLength: 45 },
          address_type_id: { type: 'string', maxLength: 191 },
          address_line_1: { type: 'string', maxLength: 250 },
          address_line_2: { type: 'string', maxLength: 250 },
          address_line_3: { type: 'string', maxLength: 250 },
          pin_code: { type: 'string', maxLength: 10 },
          city: { type: 'string', maxLength: 100 },
          state: { type: 'string', maxLength: 100 },
          country: { type: 'string', maxLength: 100 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      };
    }
  
  static get relationMappings() {

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'ru_customer_addresses.customer_id',
          to: 'customers.id'
        }
      }
    };
  }
}
  module.exports = CustomerAddress;
