
var Config = require(_pathconst.FilesPath.ConfigUrl);
// Load the AWS SDK for Node.js\

const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = Config.accessKeyId;
AWS.config.secretAccessKey = Config.secretAccessKey;
AWS.config.region = Config.regionEast;
const sqs = new AWS.SQS({ apiVersion: Config.apiVersion });


exports.addToSqs = async function (accountId, queueName, MessageBody) {
  try {
    const params = {
      // MessageGroupId: "msg_grp_id" + new Date().getTime(),
      // MessageDeduplicationId: "msg_duplication_id" + new Date().getTime(),
      MessageBody: MessageBody,
      QueueUrl: `https://sqs.ap-south-1.amazonaws.com/${accountId}/${queueName}`
    };
    let data = await sqs.sendMessage(params).promise();

    return data;
  } catch (err) {
  }
}
