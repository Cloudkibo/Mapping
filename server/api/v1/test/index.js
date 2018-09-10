const express = require('express')
const router = express.Router()

const controller = require('./test.controller')

router.get('/', controller.index)
router.get('/textmessage', controller.handleTextMessage)
router.get('/handleTextMessageWithReply', controller.handleTextMessageWithReply)
router.get('/handleStaticLocation', controller.handleStaticLocation)
router.get('/handleImageMessage', controller.handleImageMessage)
router.get('/handleDocumentMessage', controller.handleDocumentMessage)
router.get('/handleVoiceMessage', controller.handleVoiceMessage)

module.exports = router
