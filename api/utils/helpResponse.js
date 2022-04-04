const helpText = {
  statusCode: 200,
  headers: {'content-type': 'application/json'},
  body: JSON.stringify({
    'blocks': [
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '*Welcome to Parsa-Help!*'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'You can use Parsa by typing \'/parsa\' and optional parameters. If you choose not to enter any parameters, Parsa will parse all conversations in this channel.'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'You can also add parameters. They are all optional: [user] [hours to include] [channel]'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'For example: \'/parse @Jane.Doe 24\' will parse all messages by Jane Doe during the last 24 hrs. /parse 100 will parse all messages during the last 100 hrs. \'/parse aw-chat\' would parse a hypothetical \'aw-chat\'-channel.'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'After entering the command, Parsa will offer you a link to an url where you can view the parsed messages. There, you can choose which information is relevant by choosing words from the wordlist and adding them to different category-fields. You can also edit the words after you have chosen them.'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'When you are satisfied with the choices you have made, you can send the parsed information to Hubspot by pressing the \'Send to Hubspot\'-button.'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'You can also visit the Parsa-app and parse messages by using the menu on the lefthand-side of the webpage: https://main.dtatk8xusyguu.amplifyapp.com/.'
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'Thank you for using Parsa, and we hope you will have a splendid day!'
        }
      }
    ]
  }),
}

module.exports = helpText
