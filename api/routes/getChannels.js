const slackController = require('../controllers/slackController')

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
