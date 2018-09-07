const logger = require('../../../components/logger')
const webhookUtility = require('./../../../components/webhook.utility')
const TAG = '/api/v1/test/index.js'

exports.index = function (req, res) {
  console.log('endpoint is hit')
  res.status(200).json({status: 'success', payload: 'Hello World'})
}

exports.handleTextMessage = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle text message')

  const payloadType = 'message_text'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const messageBody = {
    body: req.query.message ? req.query.message : 'MessageBody'
  }
  const type = 'text'

  let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type)
  // Send to webhook
  webhookUtility.callWebhook('/webhooks', { messages: payload }, (err, result) => {
    result.status === 200
      ? res.status(200).json({ messages: payload })
      : res.status(500).json({ messages: err })
  })
}

exports.handleTextMessageWithReply = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle text message with reply')

  const payloadType = 'message_text_with_reply'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const messageBody = {
    body: req.query.message ? req.query.message : 'MessageBody'
  }
  const type = 'text'
  const context = { from: '1234567', id: webhookUtility.genRandomString() }

  let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type, null, context)
  // Send to webhook
  webhookUtility.callWebhook('/webhooks', { messages: payload }, (err, result) => {
    result.status === 200
      ? res.status(200).json({ messages: payload })
      : res.status(500).json({ messages: err })
  })
}
