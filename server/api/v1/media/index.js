const express = require('express')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

const router = express.Router()
const controller = require('./media.controller')

router.post('/', multipartyMiddleware, controller.createMedia)

router.get('/:mediaId', controller.getMedia)

router.delete('/:mediaId', controller.deleteMedia)

module.exports = router
