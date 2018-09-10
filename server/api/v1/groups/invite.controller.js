const logger = require('./../../../components/logger')
const Groups = require('./groups.model')
const Contacts = require('./../contacts/contacts.model')
const config = require('./../../../config/environment/index')
const webhookUtility = require('./../../../components/webhook.utility')
const TAG = '/server/api/v1/groups/invite.controller.js'

exports.createInvite = function (req, res) {
  const groupId = req.params.groupId
  logger.serverLog(TAG, `Create Invite for Groups ${groupId}`)
  Groups.findOne({_id: groupId})
    .exec()
    .then(group => {
      group.invite = true

      group.save(function (err) {
        if (err) {
          logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
          return res.status(500).json({ status: 'failed', err: err })
        }
        return res.status(200).json({
          groups: [{
            link: `http://${config.domain}:${config.port}/v1/invites/groups/${group._id}`
          }]
        }
        )
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}

exports.deleteInvite = function (req, res) {
  const groupId = req.params.groupId
  logger.serverLog(TAG, `Delete Invite for Groups ${groupId}`)
  Groups.findOne({_id: groupId})
    .exec()
    .then(group => {
      group.invite = false

      group.save(function (err) {
        if (err) {
          logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
          return res.status(500).json({ status: 'failed', err: err })
        }
        return res.status(200).json({})
      })
    })
    .catch(err => {
      if (Object.keys(err).length === 0) {
        logger.serverLog(TAG, `Group not found`)
        return res.status(404).json({})
      }
      logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}

exports.handleInviteClick = function (req, res) {
  const groupId = req.params.groupId ? req.params.groupId : undefined
  const phone = req.query.phone ? req.query.phone : undefined
  logger.serverLog(TAG, `Click Invite for Group ${groupId} BY ${phone}`)

  Contacts.findOne({phone: phone})
    .then(resPhone => {
      if (resPhone) {
        logger.serverLog(TAG, 'Number found')
        // Write the logic to call webhook
        let payloadWebhook = webhookUtility.PreparePayloadForWebhook('system_participant_add',
          phone, webhookUtility.genRandomString(), {admin: 'admin', phone}, 'system', groupId)

        // Send to webhook
        webhookUtility.callWebhook('/api/v1/webhooks', { messages: payloadWebhook }, (err, result) => {
          if (err) return res.status(500).json({ messages: err })
          result.status === 200
            ? res.status(200).json({ messages: payloadWebhook })
            : res.status(500).json({ messages: err })
        })
      } else {
        let payload = new Contacts({
          name: 'user',
          phone: phone
        })

        payload.save(err => {
          if (err) {
            return res.status(500).json({ status: 'failed', err: err })
          }

          Contacts.findOne({phone: phone})
            .then(res => {
              // Write the logic to call webhook
              let payloadWebhook = webhookUtility.PreparePayloadForWebhook('system_participant_add',
                res.phone, webhookUtility.genRandomString(), {admin: 'admin', phone: res.phone},
                'system', groupId)

              // Send to webhook
              webhookUtility.callWebhook('/api/v1/webhooks', { messages: payloadWebhook }, (err, result) => {
                if (err) return res.status(500).json({ messages: err })
                result.status === 200
                  ? res.status(200).json({ messages: payloadWebhook })
                  : res.status(500).json({ messages: err })
              })
            })
            .catch(err => {
              logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
              return res.status(500).json({ status: 'failed', err: err })
            })
        })
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}
