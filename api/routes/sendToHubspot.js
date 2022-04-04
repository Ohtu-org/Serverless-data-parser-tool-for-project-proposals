const hubspotController = require('../controllers/hubspotController')

module.exports = async function (event) {
  console.log(event.body)
  let data = event.body
  let buff = Buffer.from(data, 'base64')
  const sendJson = JSON.parse(buff.toString('ascii'))

  try {
    const result = await hubspotController.createDeal(sendJson)
    if (result.id) return 'success'
    return 'error'
  } catch (error) {
    console.log(error)
    return 'error'
  }
}
