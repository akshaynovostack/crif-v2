
exports.up = function (knex) {
    return knex.schema.createTable("ru_customer_bureau", table => {
        table.increments("id").primary().unsigned();
        table.string("bureau_id", 50).notNullable().comment('uuid for the uniqueness of the data');
        table.string("customer_id", 50).notNullable().comment('user/customer of the customer');
        table.string("vendor", 50).comment('vendor can be cibil crif of any other');
        table.string("order_id", 50).comment('Order id for the transaction');
        table.string("report_id", 50).comment('Report id from crif');
        table.string("access_code", 1000).comment('Access token from crif');
        table.string("credit_score", 50).comment('Order id for the transaction');
        table.string("outstanding_obligations", 50).comment('To save users outstanding obligations');
        table.string("monthly_obligations", 50).comment('To save users monthly obligations');
        table.text("report_xml").comment('Report of the Borrower');
        table.json("report_data").comment('Report data of the Borrower');
        table.text("report_url").comment('This Column will store the final report');
        table.integer('status').comment('"failed": "0","pending": "1","initiated": "2","authenticated": "3","questinare": "4","questinare_success": "5","report_generated": "6"  ').defaultTo(0);
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.unique(['customer_id', 'vendor']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("ru_customer_bureau");
};
