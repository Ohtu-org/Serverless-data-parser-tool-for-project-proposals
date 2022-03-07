const { slackService } = require('../services/slackService')
const { slackClient } = require('../services/slackClient')
const slack = slackService({ slackClient })
const { processSlackMessages } = require('../application/processSlackMessages')
const { processMessageShortcut } = require('../application/processMessageShortcut')
const savedQueries = {}
const axios = require('axios')
const baseUrl = 'http://135.181.37.120'

function slackResponse (args, id) {
  let user =   args.user ? `user: ${args.user}` : 'user: not given'
  let channel = `channel: ${args.channel}`
  let time = args.hours ? `time: ${args.hours} h` : 'time: not given'
  return  {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Your query, with parameters: ${user}, ${channel} and ${time} is ready at : http://135.181.37.120:80/${id}`,
          // text: `Your query is ready at : http://localhost/api/parse/${id}`,
        },
      },
    ],
  }
}

async function saveQuery(res, args) {
  try {
    const id = await slackMessages(res, args, true)
    res.json(slackResponse(args, id))
  } catch(error) {
    console.log(error)
  }
}

async function returnQuery(res, id) {
  try {
    if (id in savedQueries) {
      res.send(savedQueries[id])
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    if (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

async function slackMessages(res, args, save = false) {
  try {
    const resultObj = await processSlackMessages(slack, args)
    if (!save) res.send(resultObj)
    else {
      const id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
      savedQueries[id] = resultObj
      return id
    }
  } catch (error) {
    res.send(error.error)
  }
}

async function slackChannels(res) {
  try {
    const result = await slack.getChannelNames()
    res.send(result)
  } catch (error) {
    res.send(error.data.error)
  }
}

async function slackUsers(res) {
  try {
    const result = await slack.getUsers()
    res.send(result)
  } catch (error) {
    res.send(error.data.error)
  }
}

async function slackGetAllByUser(res, id) {
  try {
    const messages = await slack.findAllByUser(id)
    res.send(messages)
  } catch (error) {
    res.send(error)
  }
}

/**
 * Parses parameters and calls an api to get messages from a single thread.
 * @param {Object} payload Gives essential information when shortcut is used in workspace.
 */
async function getAllMessagesFromSingleThread(res, requestPayload) {
  const payload = JSON.parse(requestPayload)
  const channelId = payload.channel.id
  const threadTimestamp = payload.message.thread_ts
  const args = { channel: channelId, ts: threadTimestamp }
  try {
    const threadWithResponses = await slack.getThreadMessages(args)
    const resultObj = await processMessageShortcut(slack, threadWithResponses)
    const id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
    savedQueries[id] = resultObj
    axios.post(payload.response_url, {'text': 'You have parsed a thread.'})
    setTimeout(axios.post(payload.response_url, {'text': `Please check it out here: ${baseUrl}/${id}`}, 2000))
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  slackMessages,
  slackChannels,
  slackUsers,
  slackGetAllByUser,
  saveQuery,
  returnQuery,
  getAllMessagesFromSingleThread,
  slackResponse,
}
