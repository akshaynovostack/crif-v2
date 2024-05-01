const get = (whereData, whereNotData, columns, first) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await knexSqlDb('ru_customers')
        .modify((knexQuery) => {
          if (whereData) {
            knexQuery.andWhere(whereData)
          }
          if (whereNotData) {
            knexQuery.havingNotNull(whereNotData)
          }
          if (columns) {
            knexQuery.select(columns)
          } else {
            knexQuery.select([
              '*'])
          }
          if (first) {
            knexQuery.first()
          }
        });
      resolve(user)
    } catch (err) {
      reject(err);
    }
  });
};
const insert = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insertData = await knexSqlDb('ru_customers')
        .insert(data);
      resolve(insertData)
    } catch (err) {
      reject(err);
    }
  });
}
const update = (data, whereData, whereInColumn, whereInIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await knexSqlDb('ru_customers ')
        .update(data)
        .modify(knexQuery => {
          if (whereData) {
            knexQuery.where(whereData)
          }
          if (whereInColumn && whereInIds && whereInIds.length) {
            knexQuery.whereIn(whereInColumn, whereInIds)
          }
        });
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

const deleteRecord = (whereData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await knexSqlDb('ru_customers').where(whereData).del()
      resolve(user)
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  get,
  update,
  insert,
  deleteRecord
};
