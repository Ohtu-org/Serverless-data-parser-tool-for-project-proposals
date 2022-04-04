const slackController = require('../controllers/slackController')
const parseReqBody = require('../utils/parseReqBody')
const { parseTimestamp } = require('../utils/parseSlackTimestamp')

module.exports = async function (event) {
  console.log('Receiving post from Parsa front for parsing.')
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  event.body = buff.toString('ascii')
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
      return response
    } catch (error) {
      return error.error
    }
  }
}
