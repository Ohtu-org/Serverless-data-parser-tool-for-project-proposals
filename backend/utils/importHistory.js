const { WebClient, LogLevel } = require('@slack/web-api')

const {
  GetHumanMessagesFromSlack,
  GetWordsFromMessages,
  GetRealNamesFromSlack,
  GetThreads,
  GetTimeStamps,
  AddThreadToParent,
  filterOutOldMessages,
  filterMessagesByUser
} = require('./filterSlackResponse')

async function importHistory(channel, slackToken, res, oldest, user) {
  var members = {}

  const client = new WebClient(slackToken, {
    logLevel: LogLevel.DEBUG,
  })

  try {
    const channels = await client.conversations.list({})
    var channelId = channels.channels.filter(obj => {
      return obj.name == channel || obj.id == channel
    })[0].id
    const result = await client.conversations.history({
      channel: channelId,
    })
    const users = await client.users.list({})
    users.members.forEach((elem) => (members[elem.id] = elem.real_name))
    var messages = GetHumanMessagesFromSlack(result.messages)
    GetRealNamesFromSlack(messages, members)    
    const threads = GetThreads(messages)
    const threadTimestamps = GetTimeStamps(threads)

    try {
      for (let i=0; i < threadTimestamps.length; i++) {
        let threadWithReplies = await client.conversations.replies({
          channel: channelId,
          ts: threadTimestamps[i],
        })
        AddThreadToParent(threadWithReplies.messages, messages)
      }
    } catch (error) {
      console.error(error)
    }
    if (oldest) messages = filterOutOldMessages(messages, oldest)
    if (user) filterMessagesByUser(messages, user)
    const words = GetWordsFromMessages(messages)
    res.json({ messages: messages, words: words })
  } catch (error) {
    if (error){
      console.error(error)
      res.send("Error in getting data.")
    }
  }
}

module.exports = importHistory