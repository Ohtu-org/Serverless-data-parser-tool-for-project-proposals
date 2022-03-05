const nodeCache = require('node-cache')

const slackService = ({ slackClient }) => {
  const slackCache = new nodeCache({ stdTTL: 600 })

  const getUsers = async () => {
    const users = []
    let apiResult = undefined
    try {
      const cacheResult = await slackCache.get('users')
      if (!cacheResult) {
        const newApiResult = await slackClient.users.list({})
        const setCacheSuccess = slackCache.set('users', newApiResult)
        if (!setCacheSuccess) throw new Error('set Cache error in getUsers')
        
        apiResult = newApiResult
      } else apiResult = cacheResult
      
      apiResult.members
        .filter((elem) => !elem.is_bot)
        .forEach((elem) =>
          users.push({ id: elem.id, real_name: elem.real_name, username: elem.name })
        )
    } catch (error) {
      throw new Error(`Error in getUsers: ${error}`)
    }
    return users
  }

  const getChannels = async () => {
    let result = {}
    try {
      const cacheResult = await slackCache.get('channels')
      if (!cacheResult) {
        const newApiResult = await slackClient.conversations.list({})
        console.log('NEW CALL : ', newApiResult)
        const setCacheSuccess = slackCache.set('channels', newApiResult)
        if (!setCacheSuccess) throw new Error('set Cache error in getChannels')        
        result = newApiResult
      } else{
        result = cacheResult
        console.log('FOUND IN CACHE, ', result)
      }
      return result
    } catch (error) {
      throw new Error(`Error in getChannels: ${error}`)
    }
  }

  const getChannelNames = async () => {
    const channels = []
    try {
      const result = await slackClient.conversations.list({})
      result.channels.filter((elem) => elem.is_channel).forEach((elem) => channels.push(elem.name))
    } catch (error) {
      throw new Error(`Error in getChannels: ${error}`)
    }
    return channels
  }

  const getChannelIds = async () => {
    const channels = []
    const result = await slackClient.conversations.list({})
    result.channels.filter((elem) => elem.is_channel).forEach((elem) => channels.push(elem.id))
    return channels
  }

  const getChannelMessages = async (channelId) => {
    try {
      const apiResult = await slackClient.conversations.history({
        channel: channelId,
      })
      return apiResult.messages
    } catch (error) {
      throw new Error(`Error in getChannelMessages: ${error}`)
    }
  }

  const getThreadMessages = async (args) => {
    try {
      const apiResult = await slackClient.conversations.replies(args)
      return apiResult.messages
    } catch (error) {
      throw new Error(`Error in getThreadMessages: ${error}`)
    }
  }

  const getAllThreadsMessages = async (channelId, ts_array) => {
    let messages = []
    try {
      for (const ts of ts_array) {
        const apiResult = await slackClient.conversations.replies({
          channel: channelId,
          ts: ts,
        })
        messages = messages.concat(apiResult.messages)
      }
    } catch (error) {
      throw new Error(`Error in getAllThreadsMessages: ${error}`)
    }
    return messages
  }

  const getChannelWithParameters = async (channelId) => {
    let messages = []
    console.log('Not implemented ', channelId)
    return messages
  }

  const findAllByUser = async (id) => {
    let messages = []

    try {
      const result = await slackClient.conversations.list({})

      for (const channel of result.channels) {
        const channelMessages = await getChannelMessages(channel['id'])
        const ts = []
        channelMessages.forEach((msg) => {
          if (msg.thread_ts) ts.push(msg.ts)
          if (msg.user === id) messages.push(msg)
        })
        const threadMessages = await getAllThreadsMessages(channel['id'], ts)
        threadMessages.forEach((msg) => {
          if (msg.user === id) {
            messages.push(msg)
          }
        })
      }
    } catch (error) {
      throw new Error(`Error in findAllByUser: ${error}`)
    }

    return messages
  }

  const sendMessage = async (channelId, text) => {
    const result = await slackClient.chat.postMessage({
      channel: channelId,
      text: text,
    })

    console.log('sendMessage : ', channelId, text)
    console.log('Result : ', result)
  }

  return Object.freeze({
    getUsers,
    getChannels,
    getChannelNames,
    getChannelIds,
    getChannelMessages,
    getChannelWithParameters,
    getThreadMessages,
    findAllByUser,
    sendMessage,
  })
}

module.exports = { slackService }
