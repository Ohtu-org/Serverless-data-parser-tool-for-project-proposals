import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_API_URL}?route=sendToHubspot` // eslint-disable-line

const sendJSON = async(assignedWords) => {
  const sendData = JSONfromAssignedWords(assignedWords)
  const res = await axios.post(baseUrl, JSON.stringify(sendData))
  return res.data
}

const JSONfromAssignedWords = (assignedWords) => {
  const JSONObj = {}
  assignedWords.forEach(word => {
    if (!JSONObj[word.category]) JSONObj[word.category] = []
    JSONObj[word.category].push(word.word)
  })
  console.log('jsonObj '+JSONObj)
  return JSONObj
}

export default { sendJSON }
