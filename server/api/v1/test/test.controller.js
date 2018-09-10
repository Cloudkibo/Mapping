const logger = require('../../../components/logger')
const webhookUtility = require('./../../../components/webhook.utility')
const Media = require('./../media/media.model')
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
  webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
    if (err) return res.status(500).json({ messages: err })
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
  webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
    if (err) return res.status(500).json({ messages: err })
    result.status === 200
      ? res.status(200).json({ messages: payload })
      : res.status(500).json({ messages: err })
  })
}

exports.handleStaticLocation = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle static location message')

  const payloadType = 'message_static_location'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const type = 'location'

  const messageBody = {
    'address': 'Main Street Beach, Santa Cruz, CA',
    'latitude': 38.9806263495,
    'longitude': -131.9428612257,
    'name': 'Main Street Beach',
    'url': 'https://foursquare.com/v/4d7031d35b5df7744'
  }

  let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type)

  webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
    if (err) return res.status(500).json({ messages: err })
    result.status === 200
      ? res.status(200).json({ messages: payload })
      : res.status(500).json({ messages: err })
  })
}

exports.handleImageMessage = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle Image message')

  const payloadType = 'message_image'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const type = 'image'

  Media.findOne({mediaType: 'image/jpeg'})
    .exec()
    .then(media => {
      let messageBody = {
        file: media.url,
        id: media.mediaId,
        mime_type: media.mediaType,
        sha256: webhookUtility.genRandomString() + webhookUtility.genRandomString(),
        caption: req.query.caption ? req.query.caption : 'caption'
      }

      let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type)

      webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
        if (err) return res.status(500).json({ messages: err })
        result.status === 200
          ? res.status(200).json({ messages: payload })
          : res.status(500).json({ messages: err })
      })
    })
}

exports.handleDocumentMessage = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle Document message')

  const payloadType = 'message_document'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const type = 'document'

  Media.findOne({mediaType: 'application/pdf'})
    .exec()
    .then(media => {
      let messageBody = {
        file: media.url,
        id: media.mediaId,
        mime_type: media.mediaType,
        sha256: webhookUtility.genRandomString() + webhookUtility.genRandomString(),
        caption: req.query.caption ? req.query.caption : 'caption'
      }

      let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type)

      webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
        if (err) return res.status(500).json({ messages: err })
        result.status === 200
          ? res.status(200).json({ messages: payload })
          : res.status(500).json({ messages: err })
      })
    })
}

exports.handleVoiceMessage = function (req, res) {
  logger.serverLog(TAG, 'Webhook handle Voice message')

  const payloadType = 'message_voice'
  const from = req.query.phone ? req.query.phone : 'phone'
  const id = webhookUtility.genRandomString()
  const type = 'voice'

  Media.findOne({mediaType: 'audio/ogg'})
    .exec()
    .then(media => {
      let messageBody = {
        file: media.url,
        id: media.mediaId,
        mime_type: media.mediaType,
        sha256: webhookUtility.genRandomString() + webhookUtility.genRandomString(),
        caption: req.query.caption ? req.query.caption : 'caption'
      }

      let payload = webhookUtility.PreparePayloadForWebhook(payloadType, from, id, messageBody, type)

      webhookUtility.callWebhook('/api/v1/webhooks', { messages: payload }, (err, result) => {
        if (err) return res.status(500).json({ messages: err })
        result.status === 200
          ? res.status(200).json({ messages: payload })
          : res.status(500).json({ messages: err })
      })
    })
}
