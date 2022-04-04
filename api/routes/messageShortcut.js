const axios = require('axios')
const parseShortcutPayload = require('../utils/parseShortcutPayload')

module.exports = async function(event){
  console.log('message shortcut', event)
  event = parseShortcutPayload(event)
  await axios.post(event.response_url, {'text': `You parsed a thread starting: "${event.text}". See the result at: https://main.dtatk8xusyguu.amplifyapp.com/type=thread&ts=${event.thread_ts}&channel=${event.channelId}`})
  return {statusCode: 200}
}