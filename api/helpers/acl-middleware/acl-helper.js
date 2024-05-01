const {nodeAcl} = require('./acl-permissions');
var ResHelper = require(_pathconst.FilesPath.ResHelper);
var CommonHelper = require(_pathconst.FilesPath.CommonHelper);

exports.getPermissions = async (req,res,next) => {
    try{
      var roles = [];
      if(req.loggedInUser.roles && req.loggedInUser.roles.length){
        roles = req.loggedInUser.roles;
      }
      else{
        roles = req.loggedInUser.type?[req.loggedInUser.type]:[];
      }
      
      var isPermitted = false;

      for(let i = 0;i < roles.length;i++){
          const url = req.url.includes("?")?req.url.split("?")[0]:req.url;
          await nodeAcl.isAllowed(
            roles[i].toString(),
            url, req.method.toLowerCase(),(error, allowed) => {
              if (allowed) {
                isPermitted = true;
              }
          });
            
          if(isPermitted || (i === roles.length-1)){
            break;
          }
      }

      if(isPermitted || CommonHelper.isUuid(req.loggedInUser.user_id)){
        next();
      }
      else{
        ResHelper.apiResponse(res, false, "You are not allowed to visit this page", 403, "", "");
      }
    }
    catch(e){
      console.log(e);
      ResHelper.apiResponse(res, false, "You are not allowed to visit this page", 403, e, "");
    }
}
