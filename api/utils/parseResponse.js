const response = (parsedParams, frontUrl) => {
  var queryParams = ''
  Object.keys(parsedParams).forEach(key => queryParams += `${key}=${parsedParams[key]}&`)
  const resObj = {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      'blocks': [
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': '*Please view your parsed messages at:*'
          }
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `${frontUrl}${queryParams.substring(0,queryParams.length-1)}`
          }
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': '*You used the parameters:*'
          }
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `Channel = ${parsedParams.channel}, user = ${parsedParams.user || 'not chosen'} and timelimit (hrs) = ${parsedParams.hours || 'not chosen'}.`
          }
        }
      ]
    }),
  }
  return resObj

}




module.exports = response
