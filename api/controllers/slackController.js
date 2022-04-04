const { slackService } = require('../services/slackService')
const { slackClient } = require('../services/slackClient')
const slack = slackService({ slackClient })
const { processSlackMessages } = require('../application/processSlackMessages')
const { processMessageShortcut } = require('../application/processMessageShortcut')

let paramUser = ''
let paramChannel = 'general'
let paramHours = ''

/**
 * Generates the id for the query and stores it to the global query object.
 * @param {Object} args Contains user, channel and oldest parameters which are used in filtering.
 * @returns the result of getting messages.
 */
async function slackMessages(args) {
  try {
    const resultObj = await processSlackMessages(slack, args)
    return resultObj
  } catch (error) {
    console.log('error in slackMessages', error)
    return error.error
  }
}

/**
 * Gets every channel name from the Slack workspace and returns them.
 */
async function slackChannels() {
  try {
    const result = await slack.getChannelNames()
    return result
  } catch (error) {
    console.log('error in slackChannels', error)
    return error
  }
}

/**
 * Get's every user from the Slack Workspace.
 * @param {Object} res HTTP response.
 */
async function slackUsers(res) {
  try {
    const result = await slack.getUsers()
    res.send(result)
  } catch (error) {
    res.send(error.data.error)
  }
}

/**
 * Get every message from a Slack user by user's id.
 * @param {Object} res HTTP Response.
 * @param {Object} id Users id in Slack.
 */
async function slackGetAllByUser(res, id) {
  try {
    const messages = await slack.findAllByUser(id)
    res.send(messages)
  } catch (error) {
    res.send(error)
  }
}

/**
 * Get's global parameters which are needed for showing the parameters in the UI.
 * @param {Object} res HTTP Response.
 */
async function getParams(res) {
  try {
    const params =  { paramChannel, paramUser, paramHours }
    res.send(params)
  } catch (error) {
    res.sed(error)
  }  
}

/**
 * Parses parameters and calls an api to get messages from a single thread.
 * @param {Object} payload Gives essential information when shortcut is used in workspace.
 */
async function getAllMessagesFromSingleThread(args) {
  try {
    const threadWithResponses = await slack.getThreadMessages(args)
    const resultObj = await processMessageShortcut(slack, threadWithResponses)
    return resultObj
  } catch (error) {
    return error
  }
}

module.exports = {
  slackMessages,
  slackChannels,
  slackUsers,
  slackGetAllByUser,
  getAllMessagesFromSingleThread,
  getParams,
}