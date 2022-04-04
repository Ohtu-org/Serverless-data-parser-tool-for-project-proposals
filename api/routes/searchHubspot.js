const hubspotController = require('../controllers/hubspotController')

/**
 * A function that takes care of requests of type 'POST route=searchDeals' containing the
 * parameter to use as a query-string.
 * @param {*} event an object passed as parameters to the lambda, contains
 * info on the query to use as a search parameter. 
 * @returns the response from Hubspot or an error.
 */
module.exports = async function (event) {
  console.log(event)
  console.log(event.body)
  let data = event.body
  let buff = Buffer.from(data.toString('ascii'), 'base64')
  const reqObj = JSON.parse(buff)
  console.log(reqObj)

  try {
    const result = await hubspotController.searchDeals(reqObj.queryString)
    return result
  } catch (error) {
    console.log(error)
    return {error: error.message}
  }
}