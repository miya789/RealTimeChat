var AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  "accessKeyId": process.env.accessKeyId,
  "secretAccessKey": process.env.secretAccessKey,
  "region": 'ap-northeast-1'
});
const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: 'demo2',
  Select: "ALL_ATTRIBUTES"
};
dynamodb.describeTable(params, function (err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
    console.log(JSON.stringify(data, null, 2));
  }
});
dynamodb.scan(params, function (err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
    console.log(JSON.stringify(data, null, 2));
  }
});

module.exports = new AWS.DynamoDB();
