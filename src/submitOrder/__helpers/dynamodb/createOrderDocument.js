import AWS from 'aws-sdk';
import uuid from 'uuid/v4';

AWS.config.update({
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
  region: process.env.AWS_REGION
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

export default async function createOrderDocument(order) {
  const params = {
    TableName: process.env.ORDER_TABLE,
    Item: {
      orderId: uuid(),
      ...order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  return DynamoDB.put(params).promise().then(() => params.Item);
}
