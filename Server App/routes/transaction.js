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

const insertDTransactionSQL = `INSERT INTO d_trans
(d_trans_id, d_trans_create_id, d_trans_create_ip,
  d_trans_update_id, d_trans_update_ip, d_trans_note,
  d_trans_done, d_trans_quantity, d_trans_subtotal,
  d_trans_status, FK_h_product_id, FK_h_trans_id)
  VALUES
  (?,?,?,?,?,?,?,?,?,?,?,?)
`

const updateHTransactionSQL = `UPDATE h_trans SET
 h_trans_update_id=?, h_trans_update_date=?, h_trans_update_ip=?,
 h_trans_total=?, h_trans_note=?, h_trans_progress=?, h_trans_status=?
 WHERE
 h_trans_id=?
 `

const updateDTransactionSQL = `UPDATE d_trans SET
  d_trans_update_id=?, d_trans_update_date=?, d_trans_update_ip=?,
  d_trans_note = ?, d_trans_done=?, d_trans_quantity=?,
  d_trans_subtotal=?, d_trans_status=?, FK_employee_id=?
  WHERE
  d_trans_id=?
`

router.get('/getHTrans/:id?', async (req,res,next) => {
  const retVal = {
    status: 200,
  }

  try{
    const connection await db

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

router.get('/getDTrans/:id?', async (req,res,next) => {
  const retVal = {
    status: 200,
  }

  try{
    const connection await db

    const query = `SELECT * FROM d_trans ${
      req.params.id ? `where FK_h_trans_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/createHTrans', async (req,res,next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['total','status','customer_id','images','imageNotes']

  try{
    inputChecks(requiredInputs, req.body)

    const {total, note, status, customer_id} = req.body
    const create_ip = req.socket.localAddress

    const uploadedImages = []

    for(var i=0;i<5;i++){
      const fileStr = req.body.images[i];

      const uploadResponse = await cloudinary.uploader.upload(fileStr,{
        upload_preset: 'dummy_value'
      })

      uploadedImages.push(uploadResponse.url)
    }

    const connection = await db

    const {id, createId, updateId} = await userNumberGenerator(
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
      customer_id
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
      create_ip,
      note: note? note:null,
      proggress: createdHTrans[0].h_trans_progress,
      status: status,
      customer_id
    }

    return res.status(retVal.status).json(retVal)
  }  catch(error) {
    return next(error)
  }
})

router.post('/addDTrans', async (req,res,next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['done', 'quantity', 'subtotal', 'status', 'FK_h_product_id', 'FK_h_trans_id']

  try{
    inputChecks(requiredInputs, req.body)

    const {note, done, quantity, subtotal, status, h_product_id, h_trans_id} = req.body
    const create_ip = req.socket.localAddress

    const connection = await db

    const {id,createId, updateId} = await userNumberGenerator(
      connection,
      'd_trans',
      'DT'
    )

    await connection.query(insertDTransactionSQL, [
      id,
      createId,
      create_ip,
      updateId,
      note,
      done,
      quantity,
      subtotal,
      status,
      h_product_id,
      h_trans_id
    ])

    const [createdDtrans] = await connection.query(
      `SELECT * FROM d_trans WHERE d_trans_id = '${id}'`
    )

    retVal.data = {
      id,
      createId,
      create_date: createdDtrans[0].d_trans_create_date,
      create_ip,
      updateId,
      update_date: createdDtrans[0].d_trans_update_date,
      create_ip,
      note: note? note:null,
      done,
      quantity,
      subtotal,
      status : status,
      h_product_id,
      employee_id: createdDtrans[0].FK_employee_id,
      h_trans_id
    }
  } catch (error) {
    return next(error)
  }
})

router.post('/updateHTrans/:id?', async (req,res,next) => {
  const retVal={
    status: 200,
  }

  try{
    const {total, note, progress, status} = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const {id, createId, updateId} = await userNumberGenerator(
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
      total ? total: oldHTrans.h_trans_total,
      note ? note: oldHTrans.h_trans_note,
      progress ? progress: oldHTrans.h_trans_progress,
      status ? status: oldHTrans.h_trans_status,
      req.params.id
    ])

    retVal.data={
      id: req.params.id,
      total: total ? total: oldHTrans.h_trans_total,
      updateId,
      updated_date: new Date(),
      ip,
      note: note ? note: oldHTrans.h_trans_note,
      progress: progress ? progress: oldHTrans.h_trans_progress,
      status: status ? status: oldHTrans.h_trans_status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/updateDTrans/:id?', async (req,res,next) => {
  const retVal = {
    status:200
  }

  try{
    const {note, done, quantity, subtotal, status, employee_id} = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const [oldDTrans] = await connection.query(
      `SELECT * FROM d_trans WHERE d_trans_id=?`,
      req.params.id
    )

    const {id, createId, updateId} = await userNumberGenerator(
      connection,
      'd_trans',
      'DT'
    )

    await connection.query(updateDTransactionSQL, [
      updateId,
      new Date(),
      ip,
      note ? note: oldDTrans.d_trans_note,
      done ? done: oldDTrans.d_trans_done,
      quantity ? quantity: oldDTrans.d_trans_quantity,
      subtotal ? subtotal: oldDTrans.d_trans_subtotal,
      status ? status: oldDTrans.d_trans_status,
      employee_id ? employee_id: oldDTrans.FK_employee_id,
      req.params.id
    ])

    retVal.data = {
      id: req.params.id,
      updateId,
      date: new Date(),
      ip,
      note: note ? note: oldDTrans.d_trans_note,
      done: done ? done: oldDTrans.d_trans_done,
      quantity: quantity ? quantity: oldDTrans.d_trans_quantity,
      subtotal: subtotal ? subtotal: oldDTrans.d_trans_subtotal,
      status: status ? status: oldDTrans.d_trans_status,
      h_product_id: oldDTrans.FK_h_product_id,
      employee_id: employee_id ? employee_id: oldDTrans.FK_employee_id,
      h_trans_id: oldDTrans.FK_h_trans_id
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})
