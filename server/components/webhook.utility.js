const logger = require('./logger')
const TAG = 'components/webhook.utility.js'

const axios = require('axios')

function PreparePayloadForWebhook (payloadType, from, id, messageBody, type, groupId = null, context = null) {
  let messages = []
  let payload = {
    from: from,
    id: id,
    timestamp: new Date().toUTCString(),
    type: type
  }

  groupId
    ? payload.group_id = groupId
    : logger.serverLog(TAG, 'Not A Group Message')

  payloadType === 'system_participant_add'
    ? payload.system = AddParticipantMessageBody(messageBody)
    : logger.serverLog(TAG, 'Not A System Add Participant Message')

  payloadType === 'message_text'
    ? payload.text = messageBody
    : logger.serverLog(TAG, 'Not A System Text Message')

  if (payloadType === 'message_text_with_reply') {
    payload.text = messageBody
    payload.context = context
  }

  if (payloadType === 'message_static_location') {
    payload.location = messageBody
  }

  if (payloadType === 'message_image') {
    payload.image = messageBody
  }

  if (payloadType === 'message_document') {
    payload.document = messageBody
  }

  if (payloadType === 'message_voice') {
    payload.voice = messageBody
  }

  if (payloadType === 'message_audio') {
    payload.audio = messageBody
  }

  if (payloadType === 'message_video') {
    payload.video = messageBody
  }

  // Push the payload to array and return
  messages.push(payload)
  return messages
}

function AddParticipantMessageBody (messageBody) {
  logger.serverLog(TAG, 'Returned System Add Participant MessageBody')
  return {
    body: `${messageBody.admin} added ${messageBody.phone}`
  }
}

function callWebhook (endpoint, params, cb) {
  axios.post(`http://localhost:8000${endpoint}`, params)
    .then(resp => {
      cb(null, resp)
    })
    .catch(err => {
      cb(err, null)
    })
}

function genRandomString () {
  return Math.random().toString(36).slice(2)
}

exports.PreparePayloadForWebhook = PreparePayloadForWebhook
exports.callWebhook = callWebhook
exports.genRandomString = genRandomString
