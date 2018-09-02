const express = require('express')

const router = express.Router()
const validate = require('express-jsonschema').validate

const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

const validationSchema = require('./validationSchema')
const controller = require('./groups.controller')
const invite = require('./invite.controller')
const admin = require('./admin.controller')
const participants = require('./participants.controller')
const icons = require('./icons.controller')

router.get('/', controller.index)
router.post('/',
  validate({body: validationSchema.createGroupPayload}),
  controller.createGroup)
router.get('/:groupId', controller.getGroupInfo)
router.put('/:groupId',
  validate({body: validationSchema.createGroupPayload}),
  controller.updateGroup)

// Handling Invite Logic
router.get('/:groupId/invite', invite.createInvite)
router.delete('/:groupId/invite', invite.deleteInvite)

// Handling Admin Logic
router.patch('/:groupId/admins', admin.addAdmin)
router.delete('/:groupId/admins', admin.deleteAdmin)

// Handling Participants Logic
router.delete('/:groupId/participants', participants.deleteParticipants)
router.post('/:groupId/leave', participants.leaveGroup)

// Handling Group Icon Logic
router.post('/:groupId/icon', multipartyMiddleware, icons.setIcon)
router.get('/:groupId/icon', icons.getIcon)
router.delete('/:groupId/icon', icons.deleteIcon)

module.exports = router
