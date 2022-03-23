import axios from 'axios'

const channelUrl = `${process.env.REACT_APP_API_URL}?route=getChannels`

const getChannels = async() => {
  const res = await axios.get(channelUrl)
  return res.data
}

export default { getChannels }