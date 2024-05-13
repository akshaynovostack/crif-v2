exports.up = function (knex) {
    return knex.schema.createTable('ru_customer_consents', function (table) {
        table.increments('id').primary().comment('Unique identifier for the consent');
        table.string("customer_id", 50).notNullable().comment('user/customer of the customer');
        table.string('service_type', 100).notNullable().comment('Type of service for which the consent is given (e.g., personal_loan, home_loan, bureau).');
        table.string('consent_type', 100).notNullable().comment('Type of consent (e.g., terms and conditions, marketing, crif_consent, cibil_consent, vendor_name)');
        table.text('description').comment('Description of the consent (optional)');
        table.timestamp('created_at').defaultTo(knex.fn.now()).comment('Timestamp indicating when the consent was created');
        table.timestamp('updated_at').defaultTo(knex.fn.now()).comment('Timestamp indicating when the consent was last updated');

    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('customer_consents');
};
