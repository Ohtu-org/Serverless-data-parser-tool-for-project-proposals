require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const hubspotController = require('./controllers/hubspotController')
const { parseTimestamp } = require('./utils/parseSlackTimestamp')
const { parseParameters } = require('./utils/parseParameters')
const { invalidNumberOfArguments,errorResponseObject } = require('./utils/slackErrorResponses')

app.use(cors())
app.use(express.static('build'))
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())

app.get('/api/data/:channelId', (req, res) => {
  const channel = req.params.channelId
  const oldest = parseTimestamp(Date.now() * 1000, req.body.hours)
  const user = req.body.user
  const args = { channel, user, oldest }
  slackController.slackMessages(res, args)
})

app.get('/api/channels', (req, res) => {
  slackController.slackChannels(res)
})

app.get('/api/users', (req, res) => {
  slackController.slackUsers(res)
})

app.get('/api/users/:id', (req, res) => {
  slackController.slackGetAllByUser(res, req.params.id)
})

app.post('/api/data', (req, res) => {
  //expects a post with data in format, all parameters are optional: {"channel": CHANNEL_NAME, "hours": HOW_MANY_HOURS_BACK, "user": USER_NAME}
  const channel = req.body.channel || 'general'
  const oldest = parseTimestamp(Date.now() * 1000, req.body.hours)
  const user = req.body.user
  const args = { channel, user, oldest }
  slackController.slackMessages(res, args)
})

app.post('/api/parse', async (req, res) => {
  if(!req.body.text && !req.body.channel_name) res.sendStatus(400)
  try {
    const params = req.body.text.split(' ').filter(Boolean)
    if (params.length <= 3) {
      const parsedParams = await parseParameters(params, req.body.channel_name)
      slackController.saveQuery(res, parsedParams)
    } else {
      res.json(invalidNumberOfArguments(params.length))
    }
  } catch (error) {
    res.json(errorResponseObject(error.message))
  }
})

app.get('/api/parse/:id', (req, res) => {
  slackController.returnQuery(res, req.params.id)
})

app.get('/api/hubspot/deals', (req, res) => {
  hubspotController.getAllDeals(res)
})

app.get('/api/hubspot/contacts', (req, res) => {
  hubspotController.getAllContacts(res)
})

app.post('/api/sendJSON', (req, res) => {
  // auth, validate, sanitize goes here
  hubspotController.createDeal(res, req.body)
})

app.use('/:id', express.static('build'))

module.exports = app
