var slack = require('slack')
slack.api.test({hello:'world'}, console.log)
const token = process.env.SLACK_BOT_TOKEN
slack.api.test({nice:1}).then(console.log).catch(console.log)
