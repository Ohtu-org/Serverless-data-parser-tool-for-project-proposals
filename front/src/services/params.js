import axios from 'axios'

const port = process.env.REACT_APP_BACKEND_PORT || 80 // eslint-disable-line
const baseUrl = `http://${window.location.hostname}:${port}/api/params/`

const getParams = async () => {
  const res = await axios.get(`${baseUrl}`)
  return res.data
}

export default { getParams }
