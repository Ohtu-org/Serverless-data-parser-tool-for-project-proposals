module.exports = (req) => {
  const body = {}
  const bodyArr = req.body.split('&')
  if (bodyArr.length == 1 && bodyArr[0].includes('{')){
    console.log('found a json')
    req.body = JSON.parse(req.body)
    return req
  }
  bodyArr.forEach(element => {
    body[element.split('=')[0]] = element.split('=')[1]
    if (body[element.split('=')[0]] === 'null') body[element.split('=')[0]] = null 
  })
  req.body = body
  return req
}