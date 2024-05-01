const get = (whereData, whereNotData, columns, first, orderBy, hasReport) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await knexSqlDb('crif_users_transactions')
        .modify((knexQuery) => {
          if (whereData) {
            knexQuery.andWhere(whereData)
          }
          if (whereNotData) {
            knexQuery.whereNotNull(whereNotData)
          }
          if (columns) {
            knexQuery.select(columns)
          } else {
            knexQuery.select([
              '*'])
          }
          if (orderBy) {
            knexQuery.orderBy("created_at", orderBy)
          }
          if (first) {
            knexQuery.first()
          }
          if (hasReport) {
            knexQuery.whereNotNull("report_xml")
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
      let insertData = await knexSqlDb('crif_users_transactions')
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
      let user = await knexSqlDb('crif_users_transactions')
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
      let user = await knexSqlDb('crif_users_transactions').where(whereData).del()
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
