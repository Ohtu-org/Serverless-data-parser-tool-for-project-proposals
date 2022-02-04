require('dotenv').config()
const express = require('express')
const app = express()
var importHistory = require('./utils/importHistory.js')
const { parseTimestamp } = require('./utils/parseSlackTimestamp')
const slackChannels = require('./utils/slackChannels.js')
const slackUsers = require('./utils/slackUsers.js')
const slackToken = process.env.SLACK_TOKEN
const cors = require('cors')
const userController = require('./controllers/userController')

app.use(cors())
app.use(express.static('build'))

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json())

app.get('/api/data/:channelid', (req, res) => {
  importHistory(res, req.params.channelid)
})

app.get('/api/channels', (req, res) => {
  slackChannels(slackToken, res)
})

app.get('/api/users', (req, res) => {
  slackUsers(slackToken, res)
})

app.get('/api/users/:id', (req, res) => {
  if (req.params.id) userController.getAllByUser(res, req.params.id)
  else return res.badRequest()
})

app.post('/api/data', (req, res) => {
  //expects a post with data in format, all parameters are optional: {"channel": CHANNEL_NAME, "hours": HOW_MANY_HOURS_BACK, "user": USER_NAME}
  console.log(req.body)
  var channel = req.body.channel || 'general'
  var oldest = parseTimestamp(Date.now() * 1000, req.body.hours)
  var user = req.body.user

  importHistory(res, channel, oldest, user)
})

module.exports = app
