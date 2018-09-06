const path = require('path')
const config = require('./config/environment/index')

module.exports = function (app) {
  const env = app.get('env')

  // API middlewares go here
  app.use('/api/admin', require('./api/v1/test'))
  app.use('/v1/contacts', require('./api/v1/contacts'))
  app.use('/v1/groups', require('./api/v1/groups'))
  app.use('/v1/messages', require('./api/v1/messages'))
  app.use('/v1/media', require('./api/v1/media'))
  app.use('/v1/invites', require('./api/v1/groups'))

  // auth middleware go here

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  }).post((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  })
}
