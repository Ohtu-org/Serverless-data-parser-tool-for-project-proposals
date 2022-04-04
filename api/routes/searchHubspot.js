const hubspotController = require('../controllers/hubspotController')

module.exports = async function (event) {
  console.log(event.body)
  let data = event.body
  let buff = new Buffer(data, 'base64')
  const reqObj = JSON.parse(buff.toString('ascii'))
  console.log(reqObj)

  try {
    const result = await hubspotController.searchDeals(reqObj.queryString)
    return result
  } catch (error) {
    console.log(error)
    return {error: error.message}
  }
}