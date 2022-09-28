const express = require('express')
const cloudinary = require('cloudinary')
const router = express.Router()
const db = require('../db')
const { inputChecks, userNumberGenerator } = require('../helper')

const insertHTransactionSQL = `INSERT INTO h_trans
(h_trans_id, h_trans_main_photo, h_trans_main_note,
  h_trans_top_photo, h_trans_top_note, h_trans_left_photo,
  h_trans_left_note, h_trans_right_photo, h_trans_right_note,
  h_trans_below_photo, h_trans_below_note, h_trans_total,
  h_trans_create_id, h_trans_create_date, h_trans_create_ip,
  h_trans_update_id, h_trans_update_date, h_trans_update_ip,
  h_trans_note, h_trans_status, FK_customer_id)
  VALUES
  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const updateHTransactionSQL = `UPDATE h_trans SET
 h_trans_update_id=?, h_trans_update_date=?, h_trans_update_ip=?,
 h_trans_total=?, h_trans_note=?, h_trans_progress=?, h_trans_status=?
 WHERE
 h_trans_id=?
 `

router.get('/getHTrans/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const connection = await db

    const query = `SELECT * FROM h_trans ${
      req.params.id ? `where h_trans_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/createHTrans', async (req, res, next) => {
  const retVal = {
    status: 201,
  }
  const requiredInputs = [
    'total',
    'status',
    'customer_id',
    'images',
    'imageNotes',
  ]

  try {
    inputChecks(requiredInputs, req.body)

    const { total, note, status, customer_id } = req.body
    const create_ip = req.socket.localAddress

    const uploadedImages = []

    for (var i = 0; i < 5; i++) {
      const fileStr = req.body.images[i]

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'dummy_value',
      })

      uploadedImages.push(uploadResponse.url)
    }

    const connection = await db

    const { id, createId, updateId } = await userNumberGenerator(
      connection,
      'h_trans',
      'HT'
    )

    await connection.query(insertHTransactionSQL, [
      id,
      uploadedImages[0],
      imageNotes[0],
      uploadedImages[1],
      imageNotes[1],
      uploadedImages[2],
      imageNotes[2],
      uploadedImages[3],
      imageNotes[3],
      uploadedImages[4],
      imageNotes[4],
      total,
      createId,
      create_ip,
      updateId,
      create_ip,
      note,
      status,
      customer_id,
    ])

    const [createdHTrans] = await connection.query(
      `SELECT * FROM h_trans WHERE h_trans_id = '${id}'`
    )

    retVal.data = {
      id,
      total,
      createId,
      create_date: createdHTrans[0].h_trans_create_date,
      create_ip,
      updateId,
      update_date: createdHTrans[0].h_trans_update_date,
      update_ip: create_ip,
      note: note ? note : null,
      proggress: createdHTrans[0].h_trans_progress,
      status: status,
      customer_id,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/updateHTrans/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const { total, note, progress, status } = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const { id, createId, updateId } = await userNumberGenerator(
      connection,
      'h_trans',
      'HT'
    )

    const [oldHTrans] = await connection.query(
      `SELECT * FROM h_trans WHERE h_trans_id=?`,
      req.params.id
    )

    await connection.query(updateHTransactionSQL, [
      updateId,
      new Date(),
      ip,
      total ? total : oldHTrans[0].h_trans_total,
      note ? note : oldHTrans[0].h_trans_note,
      progress ? progress : oldHTrans[0].h_trans_progress,
      status ? status : oldHTrans[0].h_trans_status,
      req.params.id,
    ])

    retVal.data = {
      id: req.params.id,
      total: total ? total : oldHTrans[0].h_trans_total,
      createId: oldHTrans[0].h_trans_create_id,
      create_date: oldHTrans[0].h_trans_create_date,
      create_ip: oldHTrans[0].h_trans_create_ip,
      updateId,
      updated_date: new Date(),
      ip,
      note: note ? note : oldHTrans[0].h_trans_note,
      progress: progress ? progress : oldHTrans[0].h_trans_progress,
      status: status ? status : oldHTrans[0].h_trans_status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
