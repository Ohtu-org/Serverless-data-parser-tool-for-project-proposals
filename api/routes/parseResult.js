const slackController = require('../controllers/slackController')
const parseReqBody = require('../utils/parseReqBody')
const { parseTimestamp } = require('../utils/parseSlackTimestamp')


/**
 * A function that takes care of requests of type 'POST routes=parseResult' containing a
 * request to parse data with certain parameters.
 * @param {*} event an object passed as a parameter to the lambda-function, containing
 * info on the data to be parsed and sent as response
 * @returns either a response object or an error-message
 */
module.exports = async function (event) {
  console.log('Receiving post from Parsa front for parsing.');
  let data = event.body
  let buff = Buffer.from(data, 'base64');
  event.body = buff.toString('ascii');
  event = parseReqBody(event)

  if (event.body.type && event.body.type == 'thread'){
    try {
      const response = await slackController.getAllMessagesFromSingleThread(event.body)
      return response
    } catch (error) {
      return error.error
    }
  } else {
    const args = {channel: event.body.channel, user: event.body.user, oldest: event.body.oldest}
    if (!args.oldest) args.oldest = parseTimestamp(Date.now() * 1000, event.body.hours)
    
    try {
      const response = await slackController.slackMessages(args)
      response.query = {
        channel: event.body.channel ? event.body.channel : undefined,
        user: event.body.user ? event.body.user : undefined,
        oldest: event.body.oldest ? event.body.oldest : undefined,
      }
      return response
    } catch (error) {
      return error.error
    }
  }
}