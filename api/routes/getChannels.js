const slackController = require('../controllers/slackController')


/**
 * Function used to get Slack-channels, to serve a "GET route=getChannels request", however
 * probably should be deleted. Needs to be checked.
 * @returns a list of channels - legacy
 */
module.exports = async function () {
  console.log('Getting channels.')

  try {
    const response = await slackController.slackChannels()
    return response
  } catch (error) {
    console.log('error in getting channels', error)
    return error.error
  }
}