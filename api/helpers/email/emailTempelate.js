var Config = require(_pathconst.FilesPath.ConfigUrl);

exports.sendQueryTemplate = (user_email, query_description, user_mobile_no, user_name) => {
   return (
      `
      User Query:<br/>                       
      ${query_description}<br/><br/>
                              User Details:<br/>
                              Name: ${user_name}<br/>
                              Email:  ${user_email}<br/>
                              Phone:  ${user_mobile_no}
                              `
   )
}