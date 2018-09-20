import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
  region: process.env.AWS_REGION
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const { ROOM_TABLE } = process.env;

export default async function getRooms() {
  return DynamoDB.scan({ TableName: ROOM_TABLE }).promise();
}
