const {
  GetHumanMessagesFromSlack,
  GetWordsFromMessages,
  GetRealNamesFromSlack,
  GetThreads,
  GetTimeStamps,
  AddThreadToParent,
  filterOutOldMessages,
  filterMessagesByUser
} = require('../application/filterSlackResponse')

async function importHistory(res, slack, args) {
  const {channel, oldest, user} = args
  try {
    const channels = await slack.getChannels()
    var channelId = channels.channels.filter(obj => {
      return obj.name == channel || obj.id == channel
    })[0].id
    const result = await slack.getChannelMessages(channelId)
    let messages = result.reverse()
    
    messages = GetHumanMessagesFromSlack(result)

    addThreadsToMessages(res, slack, channelId, messages, oldest, user)

  } catch (error) {
    if (error){
      console.error(error)
      res.send('Error in getting data.')
    }
  }
}

async function addThreadsToMessages(res, slack, channelId, messages, oldest, user){
  const threads = GetThreads(messages)
  const threadTimestamps = GetTimeStamps(threads)
  try {
    var parentIndex = 0
    for (let i=0; i < threadTimestamps.length; i++) {
      var args = {channel: channelId, ts: threadTimestamps[i]}
      if (oldest) args.oldest = oldest
      let threadWithReplies = await slack.getThreadMessages(args)
      parentIndex = AddThreadToParent(threadWithReplies, messages, parentIndex)
    }
    addNamesToMessages(res, slack, messages, oldest, user)
  } catch (error) {
    console.error(error)
  }
}

async function addNamesToMessages(res, slack, messages, oldest, user){
  var members = {}
  const users = await slack.getUsers()
  users.forEach((elem) => (members[elem.id] = elem.name))
  GetRealNamesFromSlack(messages, members)
  messages.filter(elem => elem.thread_array.length > 0).forEach(elem => GetRealNamesFromSlack(elem.thread_array, members))

  applyFilters(res, messages, oldest, user)
}

function applyFilters(res, messages, oldest, user){
  if (oldest) messages = filterOutOldMessages(messages, oldest)
  if (user) messages = filterMessagesByUser(messages, user)
  const words = GetWordsFromMessages(messages)
  res.json({ messages: messages, words: words })
}

module.exports = importHistory