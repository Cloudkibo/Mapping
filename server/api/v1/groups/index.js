const express = require('express')

const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./groups.controller')
const invite = require('./invite.controller')
const admin = require('./admin.controller')
const participants = require('./participants.controller')

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

module.exports = router
