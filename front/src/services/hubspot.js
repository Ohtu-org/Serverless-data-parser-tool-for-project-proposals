import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_API_URL}` // eslint-disable-line

const searchDeals = async(queryString) => {
  const searchUrl = `${baseUrl}?route=searchDeals`
  const sendData = { queryString: queryString }
  const res = await axios.post(searchUrl, JSON.stringify(sendData))

  return res.data.results
}
const updateDeal = async(properties, id) => {
  console.log('in updateDeal')
  const sendData = { dealId: id, properties: properties }
  const updateUrl = `${baseUrl}?route=updateDeal`
  const res = await axios.post(updateUrl, JSON.stringify(sendData))
  console.log('res ' + JSON.stringify(res))
  return res.data
}


export default { searchDeals, updateDeal }

