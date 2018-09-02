const logger = require('./../../../components/logger')
const Messages = require('./messages.model')

const TAG = '/server/api/v1/groups/messages.controller.js'

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create message')
  let message = {
    recepientType: req.body.recipient_type ? req.body.recipient_type : null,
    to: req.body.to,
    type: req.body.type ? req.body.type : null,
    previewUrl: req.body.preview_url ? req.body.preview_url : false,
    messageBody: req.body.text ? req.body.text : req.body.hsm ? req.body.hsm : req.body.audio ? req.body.audio
      : req.body.document ? req.body.document : req.body.image ? req.body.image : null
  }
  if ((!req.body.type || req.body.type === 'text') && !req.body.text) {
    return res.status(201).json({ status: 'failed', payload: 'Parameters are missing' })
  }
  if ((req.body.type && req.body.type === 'hsm' && !req.body.hsm) || (req.body.hsm && !req.body.type)) {
    return res.status(201).json({ status: 'failed', payload: 'Parameters are missing' })
  }
  if ((req.body.type && req.body.type === 'audio' && !req.body.audio) || (req.body.audio && !req.body.type)) {
    return res.status(201).json({ status: 'failed', payload: 'Parameters are missing' })
  }
  if ((req.body.type && req.body.type === 'document' && !req.body.document) || (req.body.document && !req.body.type)) {
    return res.status(201).json({ status: 'failed', payload: 'Parameters are missing' })
  }
  if ((req.body.type && req.body.type === 'image' && !req.body.image) || (req.body.image && !req.body.type)) {
    return res.status(201).json({ status: 'failed', payload: 'Parameters are missing' })
  }
  Messages.create(message)
    .then(result => {
      let resp = []
      resp.push({id: result._id})
      return res.status(201).json({ messages: resp })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', payload: err })
    })
}
