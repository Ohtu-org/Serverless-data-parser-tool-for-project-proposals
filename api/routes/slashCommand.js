
const { parseParameters } = require('../utils/parseParameters')
const parseReqBody = require('../utils/parseReqBody')
const frontUrl = 'https://main.dtatk8xusyguu.amplifyapp.com/'
const helpResponse = require('../utils/helpResponse')
const parseResponse = require('../utils/parseResponse')

module.exports = async (event) => {
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  event.body = buff.toString('ascii')
  event = parseReqBody(event)

  if(!event.body.channel_name) { 
    return {status: 200, body: 'Info missing in your request.'}
  }

  const params = event.body.text.split('+').filter(Boolean)

  if (params.includes('help')) return helpResponse

  try {
    const parsedParams = await parseParameters(params, event.body.channel_name)
    return parseResponse(parsedParams, frontUrl)
  } catch (error) {
    console.log(error)
    return 'There was a problem with your parsing.'
  }
}
