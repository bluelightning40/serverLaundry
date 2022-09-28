const express = require('express')
const router = express.Router()
const db = require('../db')
const { inputChecks, userNumberGenerator } = require('../helper')

const insertPromoSQL = `INSERT INTO promo
  (promo_id, promo_name, promo_description,
    promo_value, promo_is_percentage, promo_min_total,
    promo_max_discount, promo_min_date, promo_max_date,
    promo_create_id, promo_create_ip, promo_update_id,
    promo_update_ip, promo_note, promo_status)
    VALUE
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const updatePromoSQL = `UPDATE promo SET
  promo_name=?, promo_description=?, promo_value=?,
  promo_is_percentage=?, promo_min_total=?, promo_max_discount=?,
  promo_min_date=?, promo_max_date=?, promo_update_id=?,
  promo_update_date=?, promo_update_ip=?, promo_note=?, promo_status=?
  WHERE
  promo_id=?
`

router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const connection = await db
    const query = `SELECT * FROM promo ${
      req.params.id ? `WHERE promo_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 201,
  }

  const requiredInputs = ['name', 'description', 'value', 'max_date', 'status']

  try {
    inputChecks(requiredInputs, req.body)

    const {
      name,
      description,
      value,
      is_percentage,
      min_total,
      max_discount,
      min_date,
      max_date,
      note,
      status,
    } = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const { id, createId, updateId } = await userNumberGenerator(
      connection,
      'promo',
      'PR'
    )

    await connection.query(insertPromoSQL, [
      id,
      name,
      description,
      value,
      is_percentage ? is_percentage : null,
      min_total ? min_total : null,
      max_discount ? max_discount : null,
      min_date ? min_date : null,
      max_date ? max_date : null,
      createId,
      ip,
      updateId,
      ip,
      note ? note : null,
      status,
    ])

    const [createdPromo] = await connection.query(
      `SELECT * FROM promo WHERE promo_id = '${id}'`
    )

    retVal.data = {
      id,
      name,
      description,
      value,
      is_percentage: createdPromo[0].promo_is_percentage,
      min_total: createdPromo[0].promo_min_total,
      max_discount: createdPromo[0].promo_max_discount,
      min_date: createdPromo[0].promo_min_date,
      max_date: createdPromo[0].promo_max_date,
      createId,
      create_ip: ip,
      updateId,
      update_ip: ip,
      note: createdPromo[0].note,
      status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/update/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const {
      name,
      description,
      value,
      is_percentage,
      min_total,
      max_discount,
      min_date,
      max_date,
      note,
      status,
    } = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const [oldPromo] = await connection.query(
      `SELECT * FROM promo WHERE promo_id=?`,
      req.params.id
    )

    const { updateId } = await userNumberGenerator(connection, 'promo', 'PR')

    await connection.query(updatePromoSQL, [
      name ? name : oldPromo[0].promo_name,
      description ? description : oldPromo[0].promo_description,
      value ? value : oldPromo[0].promo_value,
      is_percentage ? is_percentage : oldPromo[0].promo_is_percentage,
      min_total ? min_total : oldPromo[0].promo_min_total,
      max_discount ? max_discount : oldPromo[0].promo_max_discount,
      min_date ? min_date : oldPromo[0].promo_min_date,
      max_date ? max_date : oldPromo[0].promo_max_date,
      updateId,
      new Date(),
      ip,
      note ? note : oldPromo[0].promo_note,
      status ? status : oldPromo[0].promo_status,
      req.params.id,
    ])

    retVal.data = {
      name: name ? name : oldPromo[0].promo_name,
      description: description ? description : oldPromo[0].promo_description,
      value: value ? value : oldPromo[0].promo_value,
      is_percentage: is_percentage
        ? is_percentage
        : oldPromo[0].promo_is_percentage,
      min_total: min_total ? min_total : oldPromo[0].promo_min_total,
      max_discount: max_discount
        ? max_discount
        : oldPromo[0].promo_max_discount,
      min_date: min_date ? min_date : oldPromo[0].promo_min_date,
      max_date: max_date ? max_date : oldPromo[0].promo_max_date,
      createId: oldPromo[0].promo_create_id,
      create_date: oldPromo[0].promo_create_date,
      create_ip: oldPromo[0].promo_create_ip,
      updateId,
      update_date: new Date(),
      ip,
      note: note ? note : oldPromo[0].promo_note,
      status: status ? status : oldPromo[0].promo_status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
