var Config = require(_pathconst.FilesPath.ConfigUrl)
var jwt = require('jwt-simple')
var moment = require('moment')
var ResHelper = require(_pathconst.FilesPath.ResHelper);
var CommonHelper = require(_pathconst.FilesPath.CommonHelper);

/**
 * @api {function} createJWToken createJWToken
 *  @apiName createJWToken
 *  @apiGroup AuthHelper
 *  @apiParam {object}  user A object of user information  .
 *  @apiDescription Create unique token with 1 minutes expire time .
 */
exports.createJWToken = function (user) {
    var payload = {
        user: user,
        iat: moment().unix()
        // exp: moment().add(1, 'minutes').unix()    //Token for a whole day
    }
    return jwt.encode(payload, Config.TOKEN_SECRET)
}

/**
 * @api {function} authorize authorize
 *  @apiName authorize
 *  @apiGroup AuthHelper
 *  @apiParam {object}  req A object of Request Call from Client  .
 *  @apiParam {object}  res A object of Response Call to Client .
 *  @apiParam {callback}  next A Callback to pass request to next midleware .
 *  @apiDescription A midleware to authorize the REST call .
 */
exports.authorize = async function (req, res, next) {
    var resModel = {
        Status: false,
        Message: "",
        Data: {}
    };
    if (!req.header('Authorization')) {
        resModel.Message = 'Please make sure your request has an Authorization header';
        return res.status(401).send(resModel);
    }
    var token = req.header('Authorization');
    var payload = null
    try {
        payload = jwt.decode(token, Config.TOKEN_SECRET)
    } catch (err) {
        resModel.Message = err.message;
        return res.status(401).send(resModel);
    }
    if (payload.exp <= moment().unix()) {
        resModel.Message = 'Token has expired';
        return res.status(401).send(resModel);
    }

    req.userId = payload.userId;
    req.loggedInUser = payload.user;
    const isBackendUserLegit = await checkUserStatus(req);
    if(isBackendUserLegit){
        next()
    }
    else{
        ResHelper.apiResponse(res, false, "You are not allowed to perform this action anymore. Please contact admin", 401, {}, "");
    }
}
exports.getRequestingUser = function (token) {
    var decoded = jwt.decode(token, Config.TOKEN_SECRET);
    return decoded.user;
}


exports.isSuperAdmin = (req,res,next) => {
    if(req.loggedInUser.type === 1){
        next();
    }
    else{
        ResHelper.apiResponse(res, false, "Permission denied", 401, {}, "");
    }
}

const checkUserStatus = async (req) => {
    try{
        let getUser = [];
        // Check if student or a backend user
        if(CommonHelper.isUuid(req.loggedInUser.user_id)){
            getUser = await knexSqlDb('users')
            .andWhere({ user_id: knexSqlDb.raw(`uuid_to_bin('${req.loggedInUser.user_id}')`),status:10});
        }
        else{
            getUser = await knexSqlDb('ps_backend_users')
            .andWhere({ user_id: req.loggedInUser.user_id,status:1});
        }
        // console.log(getUser,req.loggedInUser.user_id);
        return (getUser.length?true:false);
    }
    catch(e){
        return false;
    }
}