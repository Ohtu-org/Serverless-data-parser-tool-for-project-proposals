const slashCommand = require('./routes/slashCommand')
const parseResult = require('./routes/parseResult')
const getChannels = require('./routes/getChannels')
const sendToHubspot = require('./routes/sendToHubspot')
const messageShortcut = require('./routes/messageShortcut')
const searchHubspot = require('./routes/searchHubspot')

exports.handler = async (event) => {
  console.log(event)
  var response

  if (event.queryStringParameters && event.queryStringParameters.route){
    switch(event.queryStringParameters.route) {
    case 'getChannels':
      response = await getChannels()
      break
    case 'slashCommand':
      response = await slashCommand(event)
      break
    case 'parseResult':
      response = await parseResult(event)
      break
    case 'sendToHubspot':
      response = await sendToHubspot(event)
      break
    case 'messageShortcut':
      response = await messageShortcut(event)
      break
    case 'searchDeals':
      response = await searchHubspot(event)
      break
    default:
      response = 'Check your route'
    }
  }

  return response
}