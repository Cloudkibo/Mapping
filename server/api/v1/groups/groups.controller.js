const logger = require('./../../../components/logger')
const Groups = require('./groups.model')

const TAG = '/server/api/v1/groups/groups.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the retrieve all groups')
  Groups.find({})
    .exec()
    .then(result => {
      let resp = []
      result.forEach(oneGroup => {
        resp.push({id: oneGroup._id})
      })
      return res.status(200).json({ groups: resp })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}

exports.createGroup = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Create Group')
  let group = {
    title: req.body.subject
  }

  Groups.create(group)
    .then(result => {
      let resp = []
      resp.push({creation_time: result.createtime, id: result._id})
      return res.status(201).json({ groups: resp })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', payload: err })
    })
}

exports.getGroupInfo = function (req, res) {
  logger.serverLog(TAG, 'Hit the retrieve particular group')
  Groups.findOne({_id: req.params.groupId})
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({})
      }
      let resp = {admins: result.admins,
        creation_time: result.createtime,
        creator: result.creator,
        participants: result.participants,
        subject: result.title
      }
      return res.status(200).json({ groups: resp })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      res.status(500).json({ status: 'failed', err: err })
    })
}

exports.updateGroup = function (req, res) {
  logger.serverLog(TAG, 'Hit the update group')
  Groups.findOne({_id: req.params.groupId})
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({})
      }
      Groups.updateOne({_id: req.params.groupId}, {$set: {title: req.body.subject}})
        .exec()
        .then(result => {
          return res.status(200).json({})
        })
        .catch(err => {
          logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
          res.status(500).json({ status: 'failed', err: err })
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      res.status(500).json({ status: 'failed', err: err })
    })
}
