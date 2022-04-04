module.exports = (event) => {
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  event.body = buff.toString()
  let decoded = decodeURIComponent(event.body)
  let json = JSON.parse(decoded.split('=')[1])
  const channelId = json.channel.id 
  const thread_ts = json.message.thread_ts
  const response_url = json.response_url
  let text = ''
  json.message.text.split('+').forEach(element => text += `${element} `)
  text = text.substring(0, 50) + '...'
  return { thread_ts, channelId, text, response_url }
}