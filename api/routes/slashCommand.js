
const { parseParameters } = require('../utils/parseParameters')
const parseReqBody = require('../utils/parseReqBody')
const frontUrl = 'https://main.dtatk8xusyguu.amplifyapp.com/'
const helpResponse = require('../utils/helpResponse')
const parseResponse = require('../utils/parseResponse')

/**
 * A function which takes care of requests of type 'POST route=slashCommand' containing the
 * request from a slashcommand from Slack, with parameters that the user wishes to use for parsing.
 * @param {*} event an object passed as parameter to the lambda, that contains info on
 * the parameters that should be entered into the url
 * @returns a response object with the answer to Slack, containing an url with the parameters. Or 
 * an error.
 */
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
