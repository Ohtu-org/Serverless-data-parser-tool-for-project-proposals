const {
  GetWordsFromMessages,
  GetRealNamesFromSlack,
  GetThreads,
  GetTimeStamps,
  GetHumanMessagesFromSlack,
  AddThreadToParent,
  filterOutOldMessages,
  filterMessagesByUser,
} = require('./filterSlackResponse')

const categories = require('./categories.json')

/**
 * Processes slack messages according to the args.
 * @param {Object} slack Slack Web Client.
 * @param {Object} args JSON Object containing channel, oldest and user.
 * @returns an object which contains all relevant data from messages.
 */
async function processSlackMessages(slack, args) {
  const { channel } = args
  var channelId
  var channels
  try {
    channels = await slack.getChannels()
    channelId = channels.filter((obj) => {
      return obj.name == channel || obj.id == channel
    })[0].id
  } catch (error){
    return new Error(error.message)
  }

  try {
    const result = await slack.getChannelMessages(channelId)
    let messages = result.reverse()

    messages = GetHumanMessagesFromSlack(result)
    args.messages = messages
    args.channelId = channelId
  } catch (error){
    return new Error(error.message)
  }

  try {
    const resultObj = await addThreadsToMessages(slack, args)
    resultObj.channels = channels.map(elem => elem.name)
    return resultObj
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * Adds threads to messages. Threads must be fetched from different API with a timestamp. Threads are also
 * added to the correct parent message.
 * @param {Object} slack Slack Web Client.
 * @param {Object} args Contains channel name, oldest message by hour, user which messages are wanted, messages from the channel, and channel id of the channel.
 * @returns an object which contains messages as filtered.
 */
async function addThreadsToMessages(slack, args) {
  const { channelId, oldest, user, messages } = args
  const threads = GetThreads(messages)
  const threadTimestamps = GetTimeStamps(threads)
  const promises = []
  var parentIndex = 0

  try {
    // Send all api queries at once.
    for (let i = 0; i < threadTimestamps.length; i++) {
      const query_args = { channel: channelId, ts: threadTimestamps[i] }
      if (oldest) query_args.oldest = oldest
      let apiResponse = slack.getThreadMessages(query_args)
      promises.push(apiResponse)
    }
    // Wait for all api queries to complete.
    const threadResponses = await Promise.all(promises)
    // Then process threads.
    for (let i = 0; i < threadResponses.length; i++) {
      parentIndex = AddThreadToParent(threadResponses[i], messages, parentIndex)
    }
    const resultObj = await addNamesToMessages(slack, messages, oldest, user)
    return resultObj
  } catch (error) {
    console.error(error)
  }
}

/**
 * Adds real names to Slack messages.
 * @param {Object} slack Slack Web Client.
 * @param {Object} messages List of Slack message objects which have threads.
 * @param {Number} oldest Time by hour which is the oldest wanted message.
 * @param {String} user Whos messages are wanted.
 * @returns an object which contains filtered messages.
 */
async function addNamesToMessages(slack, messages, oldest, user) {
  var members = {}

  const users = await slack.getUsers()
  users.forEach(
    (elem) => (members[elem.id] = { username: elem.username, real_name: elem.real_name })
  )
  GetRealNamesFromSlack(messages, members)
  messages
    .filter((elem) => elem.thread_array.length > 0)
    .forEach((elem) => GetRealNamesFromSlack(elem.thread_array, members))
  const result = applyFilters(messages, oldest, user)
  return result
}

// TESTING FOR MESSAGE SHORTCUT, COPY FROM addNamesToMessages without message filtering.
/**
 * Pretty similar to the one above. Is needed for the message shortcut.
 * @param {Object} slack Slack Web Client.
 * @param {Object} messages List of Slack message objects.
 * @param {Number} oldest Time by hour which is the oldest wanted message.
 * @param {String} user Whos messages are wanted.
 * @returns an object containing list of messages, list of words in messages and list of categories where the words belong.
 */
async function addNamesToThreadMessages(slack, messages, oldest, user) {
  var members = {}

  const users = await slack.getUsers()
  users.forEach(
    (elem) => (members[elem.id] = { username: elem.username, real_name: elem.real_name })
  )
  GetRealNamesFromSlack(messages, members)
  const result = applyFilters(messages, oldest, user)
  return result
}

/**
 * Applies filter to messages.
 * @param {Object} messages a list of Slack message objects where the filtering is applied to.
 * @param {Number} oldest oldest message which we want e.g 24h or 72h.
 * @param {String} user whos messages we want.
 * @returns an object containing list of messages, list of words in messages and list of categories where the words belong.
 */
function applyFilters(messages, oldest, user) {
  if (oldest) messages = filterOutOldMessages(messages, oldest)
  if (user) messages = filterMessagesByUser(messages, user)
  const words = GetWordsFromMessages(messages)
  return { messages: messages, words: words, categories: categories }
}

module.exports = { processSlackMessages, addNamesToThreadMessages }
