const { GetHumanMessagesFromSlack } = require('../application/filterSlackResponse')
const { addNamesToThreadMessages } = require('../application/processSlackMessages')

/**
 * Creates an object from the thread which can be shown in the UI.
 * Pretty similar to the processSlackMessages function in application/processSlackMessages.
 * @param {Slack client} slack Client object used to communicate with the Slack web api.
 * @param {Object} threadWithResponses Object which contains the threaded message with all responses and other useful data.
 * @returns object which can be shown in the UI.
 */
async function processMessageShortcut(slack, threadWithResponses) {
  const oldest = undefined
  const user = undefined
  var channels
  try {
    channels = await slack.getChannels()
  } catch (error){
    console.log('error in getting channels')
    throw new Error(error)
  }
  try {
    const humanMessagesFromThread = GetHumanMessagesFromSlack(threadWithResponses)
    const resultObj = await addNamesToThreadMessages(slack, humanMessagesFromThread, oldest, user)    
    resultObj.channels = channels.map(elem => elem.name)
    return resultObj
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = { processMessageShortcut }
