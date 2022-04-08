const hubspotController = require('../controllers/hubspotController')
const hubspotUrl = process.env.HUBSPOT_URL
/**
 * A function that takes care of requests of type 'POST route=updateDeals' containing the
 * parameters to use as simplePublicObjectInput and dealId.
 * @param {*} event an object passed as parameters to the lambda, contains
 * dealId and properties to be updated.
 * @returns the response from Hubspot or an error.
 */
module.exports = async function (event) {
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  const sendJson = JSON.parse(buff.toString('utf8'))
  console.log('in api routes updateHubspot sendJSon ' + JSON.stringify(sendJson))
  try {
    const result = await hubspotController.updateDeal(sendJson.properties, sendJson.dealId)
    if (result.id) {
      return { status: 'success', id: result.id, message: {text: 'Deal Successfully Updated', link:`${hubspotUrl}${result.id}/`}}
    } else return { status: 'error', id: undefined, message: `Deal Update Failed : ${result}` }
  } catch (error) {
    console.log(error)
    return { status: 'error', id: undefined, message: `Deal Update Failed : ${error.message}` }
  }
}