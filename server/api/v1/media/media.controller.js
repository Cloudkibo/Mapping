const logger = require('./../../../components/logger')
const path = require('path')
const fs = require('fs')
const Media = require('./media.model')
let mongoose = require('mongoose')

const TAG = '/server/api/v1/groups/groups.controller.js'

exports.createMedia = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Create Media')
  logger.serverLog(TAG, JSON.stringify(req.files.file))

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }

  let media = []

  if (Array.isArray(req.files.file)) {
    let requests = req.files.file.map((file) => {
      return createMediaObject(file, media)
    })
    Promise.all(requests)
      .then(() => res.status(200).json({media}))
      .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
  } else {
    let file = req.files.file
    createMediaObject(file, media).then(result => {
      return res.status(201).json({media})
    }).catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', payload: err })
    })
  }
}

exports.getMedia = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Get Media')
  Media.findOne({mediaId: req.params.mediaId})
    .then(result => {
      res.sendFile(result.url)
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${err}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}

exports.deleteMedia = function (req, res) {
  logger.serverLog(TAG, 'Hit the endpoint for Delete Media')
  Media.findOne({mediaId: req.params.mediaId})
    .then(media => {
      Media.deleteOne({mediaId: req.params.mediaId})
        .then(result => {
          fs.unlink(media.url)
          res.status(200).json({status: 'success'})
        })
        .catch(err => {
          logger.serverLog(TAG, `Inernal Server Error ${err}`)
          return res.status(500).json({ status: 'failed', err: err })
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Inernal Server Error ${err}`)
      return res.status(500).json({ status: 'failed', err: err })
    })
}

function createMediaObject (file, media) {
  let mediaId = mongoose.Types.ObjectId().toString()
  let mediaType = file.type

  let dir = path.resolve(__dirname, '../../../../uploaded_media/')
  let url = dir + '/' + mediaId + '' + file.name
  let newMedia = {
    mediaId,
    mediaType,
    url
  }
  return new Promise((resolve, reject) => {
    Media.create(newMedia)
      .then(result => {
        fs.rename(file.path, url, (err) => {
          if (err) {
            reject(err)
          }
        })
        let resp = {id: mediaId}
        media.push(resp)
        resolve(resp)
      })
      .catch(err => {
        logger.serverLog(TAG, `Inernal Server Error ${JSON.stringify(err)}`)
        reject(err)
      })
  })
}
