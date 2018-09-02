const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./messages.controller')

router.post('/',
  validate({body: validationSchema.messagePayload}),
  controller.create)

module.exports = router
