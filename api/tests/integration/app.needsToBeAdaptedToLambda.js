/*const request = require('supertest')
const assert = require('assert')

//const app = require('../../app')

jest.mock('@slack/web-api', () => {
  const mock_users = jest.fn()
  const mock_channels = jest.fn()
  const mock_history = jest.fn()
  const mock_reply = jest.fn()

  const {
    users_response,
    channels_response,
    history_response,
    thread_response,
  } = require('../service/slack_responses')

  mock_users.mockReturnValue(users_response)
  mock_channels.mockReturnValue(channels_response)
  mock_history.mockReturnValue(history_response)
  mock_reply.mockReturnValue(thread_response)

  const mock_Slack = {
    users: {
      list: mock_users,
    },
    conversations: {
      list: mock_channels,
      history: mock_history,
      replies: mock_reply,
    },
  }
  return { WebClient: jest.fn(() => mock_Slack), LogLevel: jest.fn() }
})
jest.mock('@hubspot/api-client', () => {
  const mock_deals = jest.fn()
  const allDeals = require('../service/hubspot_responses')

  mock_deals.mockReturnValue(allDeals)

  const mock_Hubspot = {
    crm: {
      deals: {
        basicApi: {
          getPage: mock_deals,
        },
      },
    },
    Client: jest.mock(),
  }
  return { Client: jest.fn(() => mock_Hubspot) }
})
describe('Test Slack Related Endpoints', () => {
  test('GET /api/channels', (done) => {
    request(app)
      .get('/api/channels')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.length).toEqual(2)
        expect(res.body).toContain('test_general')
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test('GET /api/users', (done) => {
    request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.length).toEqual(3)
        expect(res.body).toContainEqual({
          id: 'U02UAB8HUFM',
          real_name: 'RealNameTwo',
          username: 'testusertwo',
        })
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test('POST /api/data with channel parameter', (done) => {
    request(app)
      .post('/api/data')
      .send({ channel: 'test_general' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.messages.length).toEqual(2)
        expect(res.body.words).toContainEqual({
          word: 'django',
          message_ids: ['3480404c-8998-4af4-9023-2ca5cf339f8f'],
          count: 1,
          important: false,
          category: 'Technology',
        })
        expect(res.body.words).toContainEqual({
          word: 'projekti',
          message_ids: [
            '6e00d76e-0565-4356-b8f7-8fd80a8bd608',
            '3480404c-8998-4af4-9023-2ca5cf339f8f',
          ],
          count: 2,
          important: false,
          category: '',
        })
        expect(res.body.words).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ word: 'siis' })])
        )
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test('POST /api/data with channel and user parameter', (done) => {
    request(app)
      .post('/api/data')
      .send({ user: 'testusertwo', channel: 'test_general' })
      .expect(200)
      //.expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.messages.length).toEqual(1)
        expect(res.body.words).toContainEqual({
          word: 'eräs oy',
          message_ids: ['6e00d76e-0565-4356-b8f7-8fd80a8bd608'],
          count: 1,
          important: false,
          category: '',
        })
        expect(res.body.words).toContainEqual({
          word: '10.000€',
          message_ids: ['6e00d76e-0565-4356-b8f7-8fd80a8bd608'],
          count: 1,
          important: false,
          category: 'Number',
        })
        expect(res.body.words).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ word: 'on' })])
        )
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test('POST & GET /api/parse with channel and user parameter', (done) => {
    let id = ''
    request(app)
      .post('/api/parse')
      .send({ channel_name: 'test_channel', text: 'test_channel' })
      .expect(200)
      .expect((res) => {
        assert.ok(
          res.text.includes(
            '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"Your query, with parameters: user: not given, channel: test_channel and time: not given is ready at : http://135.181.37.120:80/'
          )
        )
        id = res.text.slice(-9, -5)

        request(app)
          .get(`/api/parse/${id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body.messages.length).toEqual(2)
            expect(res.body.words).toContainEqual({
              word: 'eräs oy',
              message_ids: ['6e00d76e-0565-4356-b8f7-8fd80a8bd608'],
              count: 1,
              important: false,
              category: '',
            })
            expect(res.body.messages[1].thread_array.length).toEqual(1)
          })
          .end((err) => {
            if (err) return done(err)
            return done()
          })
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })

    request(app)
      .post('/api/parse')
      .send({ channel_name: 'test_channel' })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test('GET /api/data/:id', (done) => {
    request(app)
      .get('/api/data/C02UCV0GQJZ')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.messages.length).toEqual(2)
        expect(res.body.words).toContainEqual({
          word: 'django',
          message_ids: ['3480404c-8998-4af4-9023-2ca5cf339f8f'],
          count: 1,
          important: false,
          category: 'Technology',
        })
        expect(res.body.words).toContainEqual({
          word: 'projekti',
          message_ids: [
            '6e00d76e-0565-4356-b8f7-8fd80a8bd608',
            '3480404c-8998-4af4-9023-2ca5cf339f8f',
          ],
          count: 2,
          important: false,
          category: '',
        })
        expect(res.body.words).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ word: 'on' })])
        )
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})

describe('Test Hubspot Related Endpoints', () => {
  test('GET /api/hubspot/deals', (done) => {
    request(app)
      .get('/api/hubspot/deals')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.length).toEqual(3)
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '6598797157',
            }),
          ])
        )
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})*/
