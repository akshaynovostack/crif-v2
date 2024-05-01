const { development } = require('../../knexfile');
var dbContext = {
  knex: null,
  getContext: function() {
    knex = require('knex')(development);
    return knex;
  },
  destroyContext: function() {
    console.log("Distroy end.");
  }
};
module.exports = dbContext;
