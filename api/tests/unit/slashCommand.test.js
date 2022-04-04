const slashCommand = require('./../../routes/slashCommand')

/**
 * The constants listed below are the raw eventbodies retrieved from the logs after sending a slashcommand from Slack.
 */

const parseDemochannel = 'dG9rZW49VzI1aHY5eXk5dTFXaVVaZGc1eVpJbWRlJnRlYW1faWQ9VDAyVU5WN1Y0R1omdGVhbV9kb21haW49dGVzdC1wYXJzaW5nLXdwJmNoYW5uZWxfaWQ9QzAzM1dNOUhHQVomY2hhbm5lbF9uYW1lPWRlbW9fY2hhbm5lbCZ1c2VyX2lkPVUwMlVBQjhIVUZNJnVzZXJfbmFtZT1qYW4ucnVuZHQmY29tbWFuZD0lMkZwYXJzZSZ0ZXh0PSZhcGlfYXBwX2lkPUEwMlVGUFFTTDFaJmlzX2VudGVycHJpc2VfaW5zdGFsbD1mYWxzZSZyZXNwb25zZV91cmw9aHR0cHMlM0ElMkYlMkZob29rcy5zbGFjay5jb20lMkZjb21tYW5kcyUyRlQwMlVOVjdWNEdaJTJGMzMzNDIwMTA1NjA4NSUyRjY4aERybE5kdVcyVHpSYkNwNnBubjlTNSZ0cmlnZ2VyX2lkPTMzNjA4MzI4MDc2OTYuMjk3NDk5Mzk5MDU3Ny4xODJjOGNmYjM0ZWM3YTk5NGYxYzVhZDM3Y2QzMDYwNQ=='
const parse24 = 'dG9rZW49VzI1aHY5eXk5dTFXaVVaZGc1eVpJbWRlJnRlYW1faWQ9VDAyVU5WN1Y0R1omdGVhbV9kb21haW49dGVzdC1wYXJzaW5nLXdwJmNoYW5uZWxfaWQ9QzAzM1dNOUhHQVomY2hhbm5lbF9uYW1lPWRlbW9fY2hhbm5lbCZ1c2VyX2lkPVUwMlVBQjhIVUZNJnVzZXJfbmFtZT1qYW4ucnVuZHQmY29tbWFuZD0lMkZwYXJzZSZ0ZXh0PTI0JmFwaV9hcHBfaWQ9QTAyVUZQUVNMMVomaXNfZW50ZXJwcmlzZV9pbnN0YWxsPWZhbHNlJnJlc3BvbnNlX3VybD1odHRwcyUzQSUyRiUyRmhvb2tzLnNsYWNrLmNvbSUyRmNvbW1hbmRzJTJGVDAyVU5WN1Y0R1olMkYzMzM3MDcwOTQ2Mjc1JTJGZkpPckowTGhUbExhdWM1UWo0S2ZJTUJyJnRyaWdnZXJfaWQ9MzM2MDgyNDk5ODY0MC4yOTc0OTkzOTkwNTc3LjBjMjE4OGQyYzI1ZDNlMDI0ZTNmMGI3NDAzMjQ2MTNm'
const parseUser = 'dG9rZW49VzI1aHY5eXk5dTFXaVVaZGc1eVpJbWRlJnRlYW1faWQ9VDAyVU5WN1Y0R1omdGVhbV9kb21haW49dGVzdC1wYXJzaW5nLXdwJmNoYW5uZWxfaWQ9QzAzM1dNOUhHQVomY2hhbm5lbF9uYW1lPWRlbW9fY2hhbm5lbCZ1c2VyX2lkPVUwMlVBQjhIVUZNJnVzZXJfbmFtZT1qYW4ucnVuZHQmY29tbWFuZD0lMkZwYXJzZSZ0ZXh0PSU0MGphbi5ydW5kdCZhcGlfYXBwX2lkPUEwMlVGUFFTTDFaJmlzX2VudGVycHJpc2VfaW5zdGFsbD1mYWxzZSZyZXNwb25zZV91cmw9aHR0cHMlM0ElMkYlMkZob29rcy5zbGFjay5jb20lMkZjb21tYW5kcyUyRlQwMlVOVjdWNEdaJTJGMzMzMDQzMzA3NDAyMiUyRlZ5MnBGWGNrc2lERE5pbnZPNVBiOTFQViZ0cmlnZ2VyX2lkPTMzMzQyMDYzMDQ1NDkuMjk3NDk5Mzk5MDU3Ny42NjE2ZjhkZmY0OWFiY2M2MTAwYjUyYjFmOWYwM2VmYg=='
const parseUser24 = 'dG9rZW49VzI1aHY5eXk5dTFXaVVaZGc1eVpJbWRlJnRlYW1faWQ9VDAyVU5WN1Y0R1omdGVhbV9kb21haW49dGVzdC1wYXJzaW5nLXdwJmNoYW5uZWxfaWQ9QzAzM1dNOUhHQVomY2hhbm5lbF9uYW1lPWRlbW9fY2hhbm5lbCZ1c2VyX2lkPVUwMlVBQjhIVUZNJnVzZXJfbmFtZT1qYW4ucnVuZHQmY29tbWFuZD0lMkZwYXJzZSZ0ZXh0PSU0MGphbi5ydW5kdCsyNCZhcGlfYXBwX2lkPUEwMlVGUFFTTDFaJmlzX2VudGVycHJpc2VfaW5zdGFsbD1mYWxzZSZyZXNwb25zZV91cmw9aHR0cHMlM0ElMkYlMkZob29rcy5zbGFjay5jb20lMkZjb21tYW5kcyUyRlQwMlVOVjdWNEdaJTJGMzMzNDIwOTE5MTc2NSUyRlJmVWtkN1E3QmJHYmV3WjY0M2V5QzFaaSZ0cmlnZ2VyX2lkPTMzMzcwODY4OTI0NjcuMjk3NDk5Mzk5MDU3Ny4zNmQ0MzBmMDkxYjc5NDBlZDgzZmMwMmFmOWU2MTNkNg=='
const parseHelp = 'dG9rZW49VzI1aHY5eXk5dTFXaVVaZGc1eVpJbWRlJnRlYW1faWQ9VDAyVU5WN1Y0R1omdGVhbV9kb21haW49dGVzdC1wYXJzaW5nLXdwJmNoYW5uZWxfaWQ9QzAzM1dNOUhHQVomY2hhbm5lbF9uYW1lPWRlbW9fY2hhbm5lbCZ1c2VyX2lkPVUwMlVBQjhIVUZNJnVzZXJfbmFtZT1qYW4ucnVuZHQmY29tbWFuZD0lMkZwYXJzZSZ0ZXh0PWhlbHAmYXBpX2FwcF9pZD1BMDJVRlBRU0wxWiZpc19lbnRlcnByaXNlX2luc3RhbGw9ZmFsc2UmcmVzcG9uc2VfdXJsPWh0dHBzJTNBJTJGJTJGaG9va3Muc2xhY2suY29tJTJGY29tbWFuZHMlMkZUMDJVTlY3VjRHWiUyRjMzNDk3ODg5NDc5NjklMkZiWGVocWVoeUV2ZnhDaFcwbWRSYXlVaTcmdHJpZ2dlcl9pZD0zMzM0Mjk2OTMyNjkzLjI5NzQ5OTM5OTA1NzcuNzUzODkxM2IyNjdhYTQ0NGI4YzI1NmE4ODY5NTYwOWY='

const baseUrl = 'https://main.dtatk8xusyguu.amplifyapp.com/'

test('Parsing without parameters from demochannel returns url with demochannel', async () => {
  const eventObj = {queryStringParameters : {route: 'slashCommand'}, body: parseDemochannel}
  const response = await slashCommand(eventObj)
  expect(response.body.includes(baseUrl+'channel=demo_channel&user=null&oldest=null&hours=null')).toBe(true)
})

test('Parsing with hour-parameter returns url with hour-limitation', async () => {
  const eventObj = {queryStringParameters : {route: 'slashCommand'}, body: parse24}
  const response = await slashCommand(eventObj)
  expect(response.body.includes('&hours=24')).toBe(true)
  expect(response.body.includes('Channel = demo_channel, user = not chosen and timelimit (hrs) = 24.')).toBe(true)
})

test('Parsing with user-parameter returns url with user-limitation', async () => {
  const eventObj = {queryStringParameters : {route: 'slashCommand'}, body: parseUser}
  const response = await slashCommand(eventObj)
  expect(response.body.includes(baseUrl + 'channel=demo_channel&user=@jan.rundt&oldest=null&hours=null')).toBe(true)
  expect(response.body.includes('Channel = demo_channel, user = @jan.rundt and timelimit (hrs) = not chosen.')).toBe(true)
})

test('Parsing with user- and hour-parameter returns url with user- and hour-limitation', async () => {
  const eventObj = {queryStringParameters : {route: 'slashCommand'}, body: parseUser24}
  const response = await slashCommand(eventObj)
  expect(response.body.includes(baseUrl + 'channel=demo_channel&user=@jan.rundt')).toBe(true)
  expect(response.body.includes('&hours=24')).toBe(true)
  expect(response.body.includes('Channel = demo_channel, user = @jan.rundt and timelimit (hrs) = 24.')).toBe(true)
})

test('Parsing with help command will return the manual for Parsa', async () => {
  const eventObj = {queryStringParameters : {route: 'slashCommand'}, body: parseHelp}
  const response = await slashCommand(eventObj)
  expect(response.body.includes('Thank you for using Parsa, and we hope you will have a splendid day!')).toBe(true)  
})