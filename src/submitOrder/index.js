import { parseAndGetAPIGatewayInput } from './__helpers/utilities/parseAndGetAPIGatewayInput';
import getErrorMessage from './__helpers/utilities/getErrorMessage';
import createOrderDocument from './__helpers/dynamodb/createOrderDocument';

function validateOrder(order) {
  if (!order.email) {
    throw new Error('email is required field');
  }
  if (!order.orderType) {
    throw new Error('orderType is required');
  }
  if (order.orderType !== 'house' && order.orderType !== 'furnitures' && order.orderType !== 'boxes') {
    throw new Error('Invalid orderType');
  }
  if (Array.isArray(order.items) && order.items.length > 0) {
    throw new Error('Order contains no items, Invalid Order');
  }
  if (!order.originAddress) {
    throw new Error('Origin addresses required');
  } else if (!order.originAddress.city || !order.originAddress.country) {
    throw new Error('Origin city/country not provided');
  }
  if (!order.destinationAddress) {
    throw new Error('Destination addresses required');
  } else if (!order.destinationAddress.city || !order.destinationAddress.country) {
    throw new Error('Destination city/country not provided');
  }
}

module.exports.submitOrder = async function submitOrder(events, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    let {
      params: order
    } = parseAndGetAPIGatewayInput(events);

    validateOrder(order);

    order = await createOrderDocument(order);

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: false,
        errorMessage: '',
        result: order
      })
    });
  } catch (err) {
    console.error('Error in getting list of order', err);
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: true,
        errorMessage: getErrorMessage(err),
        results: []
      })
    });
  }
};
