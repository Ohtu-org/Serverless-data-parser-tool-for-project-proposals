const hubspotService = require('../services/hubspotService')
const hubspotClient = require('../services/hubspotClient')
const hubspot = hubspotService(hubspotClient)

const getAllDeals = async (res) => {
  try {
    const result = await hubspot.getAllDeals()
    if (result) res.send(result)
    else res.status(500).send('No result : getAllDeals')
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const searchDeals = async (queryString) => {
  try {
    const result = await hubspot.searchDeals(queryString)
    return result
    // if (result) res.send(result)
    // else res.status(500).send('No result : getAllDeals')
  } catch (error) {
    return {error: error.message}
  }
}

const getAllContacts = async (res) => {
  try {
    const result = await hubspot.getAllContacts()
    if (result) res.send(result)
    else res.status(500).send('No result : getAllContacts')
  } catch (error) {
    res.status(500).send(`${error.message}`)
  }
}

/**
 * Updates an existing deal in Hubspot.
 * @param {Object} properties includes the fields that will be updated.
 * @param {Number} id dealId number of the deal that will be updated.
 * @returns Deal object.
 */
const updateDeal = async (properties, id) => {
  const simplePublicObjectInput = { properties }
  const dealId = JSON.stringify(id)
  const idProperty = undefined
  console.log('api controller dealobject ' + JSON.stringify(simplePublicObjectInput))
  try {
    const result = await hubspot.updateDeal(dealId, simplePublicObjectInput, idProperty)
    console.log('hubController result ' + JSON.stringify(result))
    return result
  } catch (error) {
    return {error: error.message}
  }
}

const createDeal = async (obj) => {
  // create new deal based on json sent from UI
  // only customer & price are used for testing new deal creation.
  // No custom properties space available atm.
  // TODO: use existing custom properties to store our data? 
  var description = ''
  Object.keys(obj).forEach((key) => {
    if (key !== 'Customer' && key !== 'Price') description += `${key}: ${obj[key]}, `
  })
  description = description.substring(0,description.length-2)
  try {
    const price = String(obj.Price || '0').replace(/[^0-9,]+/g, '')
    const deadline = obj.Deadline ? new Date(obj.Deadline) : undefined
    const technology = obj.Technology ? String(obj.Technology) : undefined
    const contact = obj.Contact ?  String(obj.Contact) : undefined
    const fte = obj.FTEs ? Number(obj.FTEs) : undefined
    const SimplePublicObjectInput = {
      properties: {
        dealname: `Deal ${obj.Customer || 'no client'}`,
        amount: Number(price),
        description: description,
        parsa_deadline: deadline,
        hs_next_step: contact,
        parsa_technologies: technology,
        mrr_jan_23: fte
      },
    }
    console.log('HS CONTROLLER Simple obj be4 sending to hubspot create', SimplePublicObjectInput)
    const result = await hubspot.createDeal(SimplePublicObjectInput)
    console.log('RESPONSE Result ID : ', result.id)
    return result
  } catch (e) {
    console.log(e)
    return 'error'
  }
}
const getOwners = async () => {
  // For testing, remove later.
  const email = undefined
  const after = undefined
  const limit = 100
  const archived = false

  try {
    const apiResponse = await hubspot.crm.owners.ownersApi.getPage(email, after, limit, archived)
    console.log(JSON.stringify(apiResponse.body, null, 2))
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}
module.exports = { getAllDeals, updateDeal, createDeal, getAllContacts, getOwners, searchDeals }
