const express = require('express')
const router = express.Router()

const controller = require('./test.controller')

router.get('/', controller.index)
router.get('/textmessage', controller.handleTextMessage)
router.get('/handleTextMessageWithReply', controller.handleTextMessageWithReply)

module.exports = router
