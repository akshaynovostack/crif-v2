var eventbridge = new AWS.EventBridge({ apiVersion: '2015-10-07' });

AWS.config.apiVersions = {
    eventbridge: '2015-10-07',
    // other service API versions
};

exports.addToEventBridge = async function (data) {
    try {
        var params = {
            Name: 'STRING_VALUE', /* required */
            EventSourceName: 'STRING_VALUE',
            Tags: [
                {
                    Key: 'STRING_VALUE', /* required */
                    Value: 'STRING_VALUE' /* required */
                },
                /* more items */
            ]
        };
        eventbridge.createEventBus(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred

            else console.log(data);           // successful response
        });
    } catch (err) {
        resModel.Status = false;
        resModel.Message = 'Error occured during execution';
        resModel.Data = "";
        return resModel;
    }
}
