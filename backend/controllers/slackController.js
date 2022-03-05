const { slackService } = require('../services/slackService')
const { slackClient } = require('../services/slackClient')
const slack = slackService({ slackClient })
const { addThreadsToMessages } = require('../application/processSlackMessages')
const { GetHumanMessagesFromSlack } = require('../application/filterSlackResponse')
const savedQueries = {}

async function saveQuery(res, args) {
  try {
    const id = await importHistory(res, args, true)
    let user =   args.user ? `user: ${args.user}` : 'user: not given'
    let channel = `channel: ${args.channel}`
    let time = args.hours ? `time: ${args.hours} h` : 'time: not given'
    res.json({
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
    })
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

async function importHistory(res, args, save = false) {
  // channel, oldest, user are contained in args
  const { channel } = args
  try {
    const channels = await slack.getChannels()
    var channelId = channels.channels.filter((obj) => {
      return obj.name == channel || obj.id == channel
    })[0].id
    const result = await slack.getChannelMessages(channelId)
    let messages = result.reverse()

    messages = GetHumanMessagesFromSlack(result)
    args.messages = messages
    args.channelId = channelId

    const resultObj = await addThreadsToMessages(res, slack, args)
    if (!save) res.send(resultObj)
    else {
      const id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
      savedQueries[id] = resultObj
      return id
    }
  } catch (error) {
    if (error) {
      console.error(error)
      res.status(500).send(`${error.message}`)
    }
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
module.exports = {
  importHistory,
  slackChannels,
  slackUsers,
  slackGetAllByUser,
  saveQuery,
  returnQuery,
}
