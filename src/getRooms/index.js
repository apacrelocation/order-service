import getErrorMessage from './__helpers/utilities/getErrorMessage';
import getRoomDocuments from './__helpers/dynamodb/getRoomDocuments';
import { parseAndGetAPIGatewayInput } from './__helpers/utilities/parseAndGetAPIGatewayInput';

module.exports.getRooms = async function getRooms(events, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const {
      params
    } = parseAndGetAPIGatewayInput(events);

    const rooms = await getRoomDocuments(params.orderType);
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: false,
        errorMessage: '',
        results: rooms
      })
    });
  } catch (err) {
    console.error('Error in getting list of rooms', err);
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
