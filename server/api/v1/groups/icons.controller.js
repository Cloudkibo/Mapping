const logger = require('./../../../components/logger')
const Groups = require('./groups.model')
const TAG = '/server/api/v1/groups/invite.controller.js'
const path = require('path')
const fs = require('fs')

exports.setIcon = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Set Icon')
  logger.serverLog(TAG, JSON.stringify(req.files.file))

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }

  let groupId = req.params.groupId

  let dir = path.resolve(__dirname, '../../../../group_icons/')
  let url = dir + '/' + groupId + '' + req.files.file.name

  Groups.updateOne({_id: groupId}, {icon: url}, (err, group) => {
    if (err) {
      res.json({})
    }
    fs.rename(req.files.file.path, url, (err) => {
      if (err) {
        res.json({})
      }
    })
    logger.serverLog(TAG, `succesfully updated icon for ${groupId}`)
    res.sendStatus(200)
  })
}

exports.getIcon = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Get Icon')
  let groupId = req.params.groupId
  Groups.findOne({_id: groupId}, (err, group) => {
    logger.serverLog(TAG, group)
    if (err) {
      res.status(500).json({ status: 'failed', err: err })
    }
    if (!group || !group.icon) {
      res.sendStatus(404)
    }
    logger.serverLog(TAG, `succesfully retrieved icon for ${groupId}`)
    res.sendFile(group.icon)
  })
}

exports.deleteIcon = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Delete Icon')
  let groupId = req.params.groupId
  Groups.findOne({_id: groupId}, (err, group) => {
    if (err) {
      res.status(500).json({ status: 'failed', err: err })
    }
    if (!group) {
      res.sendStatus(404)
    }
    Groups.updateOne({_id: groupId}, {icon: null}, (err, updatedGroup) => {
      // logger.serverLog(TAG, group)
      if (err) {
        res.status(500).json({ status: 'failed', err: err })
      }
      if (group.icon) {
        fs.unlink(group.icon)
      }
      logger.serverLog(TAG, `succesfully deleted icon for ${groupId}`)
      res.sendStatus(200)
    })
  })
}
