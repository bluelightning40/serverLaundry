const express = require('express')
const router = express.Router()
const db = require('../db')
const { inputChecks, userNumberGenerator } = require('../helper')

const insertProductSQL = `INSERT INTO product
(product_id, product_name, product_type, product_price, product_brand,
 product_stock, product_category, product_create_id, product_create_ip,
 product_update_id, product_update_ip, product_note, product_status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const insertHProductSQL = `INSERT INTO h_product
(h_product_id, h_product_price, h_product_create_id, h_product_create_ip,
 h_product_update_id, h_product_update_ip, h_product_note, h_product_status,
 FK_product_id)
VALUES (?,?,?,?,?,?,?,?,?)
`

const updateProductSQL = `UPDATE product SET product_name=?, product_type=?, product_price=?,
product_brand=?, product_stock=?, product_category=?, product_update_id=?, product_update_ip=?,
product_update_date=?, product_note=?, product_status=?
WHERE product_id=?
`

router.get('/getProduct/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try{
    const connection = await db
    const query = `SELECT * FROM product ${
      req.params.id ? `where product_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error){
    return next(error)
  }
})

router.get('/getHProduct/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try{
    const connection = await db
    const query = `SELECT * FROM h_product ${
      req.params.id ? `where FK_product_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error){
    return next(error)
  }
})

router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name','type','price','stock','category', 'status']

  try{
    inputChecks(requiredInputs, req.body)

    const {name, type, price, brand, stock, category, note, status} = req.body
    const create_ip = req.socket.localAddress

    const connection = await db

    // Creating ID String
    const {id, createId, updateId} = await userNumberGenerator(
      connection,
      'product',
      'P'
    )

    const {h_id, h_createId, h_updateId} = await userNumberGenerator(
      connection,
      'h_product',
      'HP'
    )

    // Inserting data to Product Table
    await connection.query(insertProductSQL, [
      id,
      name,
      type,
      price,
      brand,
      stock,
      category,
      createId,
      create_ip,
      updateId,
      create_ip,
      note,
      status,
    ])

    // Inserting data to h_Product Table
    await connection.query(insertHProductSQL, [
      h_id,
      price,
      h_createId,
      create_ip,
      h_updateId,
      create_ip,
      note,
      status,
      id,
    ])

    //Select created Product for return Value
    const [createdProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id = '${id}'`
    )

    retVal.data = {
      id,
      name,
      type,
      price,
      brand,
      stock,
      category,
      createId,
      create_date: createdProduct[0].product_create_date,
      create_ip,
      note: note? note : null,
      status: status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error){
    return next(error)
  }
})

router.post('/update/:id', async (req,res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['name','type','price','stock','category', 'status']

  try{
    inputChecks(requiredInputs, req.body)

    const {name, type, price, brand, stock, category, note, status} = req.body
    const update_ip = req.socket.localAddress

    const connection = await db

    const [oldProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id=?`,
      req.params.id
    )

    // Creating ID String
    const {id, createId, updateId} = await userNumberGenerator(
      connection,
      'product',
      'P'
    )

    const {h_id, h_createId, h_updateId} = await userNumberGenerator(
      connection,
      'h_product',
      'HP'
    )

    //updating data
    await connection.query(updateProductSQL, [
      name,
      type,
      price,
      brand,
      stock,
      category,
      updateId,
      ip,
      new Date(),
      notes ? notes : oldProduct.product_note,
      status,
      req.params.id,
    ])

    retVal.data = {
      id: req.params.id,
      name,
      type,
      price,
      brand,
      stock,
      category,
      updateId,
      ip,
      updated_date: new Date(),
      notes: notes? notes : oldProduct.product_note,
      status: status,
    }

    //inserting newData to h_product
    await connection.query(insertHProductSQL, [
      h_id,
      price,
      h_createId,
      create_ip,
      h_updateId,
      create_ip,
      note,
      status,
      id,
    ])

    return res.status(retVal.status).json(retVal)
  } catch(error) {
    return next(error)
  }
})

module.exports = router
