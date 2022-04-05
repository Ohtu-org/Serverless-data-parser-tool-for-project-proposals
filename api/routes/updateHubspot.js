const hubspotController = require('../controllers/hubspotController')

module.exports = async function (event) {
  console.log('in api routes updateHubspot')
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  const sendJson = JSON.parse(buff.toString('utf8'))
  //console.log('sendJson id ' + JSON.stringify(sendJson.dealId))
  //console.log('sendJson properties ' + JSON.stringify(sendJson.properties))
  try {
    const result = await hubspotController.updateDeal(sendJson.properties, sendJson.dealId)
    //console.log('in api routes updateDeal result ' + JSON.stringify(result))
    if (result) return result
    return 'error'
  } catch (error) {
    console.log(error)
    return 'error'
  }
}