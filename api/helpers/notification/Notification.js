var FCM = require('fcm-push');
var _dbContaxt = require(_pathconst.FilesPath.DBContaxt);
var Config = require(_pathconst.FilesPath.ConfigUrl);

var resModel = {
    Status: false,
    Message: "",
    Data: {}
};

exports.generatepushfordoc = async function (PushNotificationUserId, DocName, FolderName, NotoficationType) {
    try {
        var spRes = await _dbContaxt.getContext().raw('Exec LR_GetDevice ?', [PushNotificationUserId]);
        _dbContaxt.destroyContext();
        if (spRes != null && spRes.length > 0) {
            spRes.forEach(function (row) {
                if (row.Token && row.Token.length > 0) {
                    if (NotoficationType = "NewDoc")
                        SendDocPush(row.Token, 'New document uploaded', DocName, FolderName);
                    else if (NotoficationType = "UpdateAnnotation")
                        SendDocPush(row.Token, 'Document to sign', DocName, FolderName);
                    resModel.Status = true;
                    resModel.Message = 'Success';
                    resModel.Data = {};
                    return resModel;
                } else {
                    resModel.Status = false;
                    resModel.Message = 'This user is not registered on mobile';
                    resModel.Data = {};
                    return resModel;
                }
            });
        } else {
            resModel.Status = false;
            resModel.Message = 'This user is not registered on mobile';
            resModel.Data = {};
            return resModel;
        }
    } catch (err) {
        resModel.Status = false;
        resModel.Message = 'Error occured during execution';
        resModel.Data = "";
        return resModel;
    }
}

// exports.generatepushfordoc = function (PushNotificationUserId, DocName, FolderName) {
//     try {
//         _dbContaxt.getContext().raw('Exec LR_GetDevice ?', [PushNotificationUserId]).then(function (spRes) {
//             if (spRes != null && spRes.length > 0) {
//                 spRes.forEach(function (row) {
//                     //console.log(row.Token);
//                     if (row.Token && row.Token.length > 0) {
//                         SendDocPush(row.Token, 'New document uploaded', DocName, FolderName);
//                     }
//                 });
//             }
//         }).catch(function (err) {
//             throw err;
//         }).finally(function (err) {
//             _dbContaxt.destroyContext();
//         });
//     }
//     catch (err) {
//         return err;
//         // resModel.Status = false;
//         // resModel.Message = 'Error occured during execution';
//         // resModel.Data = "";
//         // res.json(resModel);
//     }
// }

function SendDocPush(paramToken, paramTitle, DocName, FolderName) {
    try {
        var fcm = new FCM(Config.SERVER_KEY);

        var message = {
            to: paramToken, // required fill with device token or topics
            collapse_key: 'green', //'your_collapse_key', 
            data: {
                title: paramTitle,
                body: 'New document (' + DocName + ') is uploaded in ' + FolderName,
                type: 'document',
                status: ''
            },
            notification: {
                title: paramTitle,
                body: 'New document (' + DocName + ') is uploaded in ' + FolderName,
                sound: "default"
            }
        };

        //callback style
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    } catch (err) {
        resModel.Status = false;
        resModel.Message = 'Error occured during execution';
        resModel.Data = "";
        return resModel;
    }
}