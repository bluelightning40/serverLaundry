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

router.get('/getPromo/:id?', async (req,res,next)=>{
  const retVal = {
    status: 200
  }

  try{
    const connection = await db
    const query = `SELECT * FROM promo ${
      req.params.id ? `WHERE promo_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data=rows

    return res.status(retVal.status).json(retVal)
    
  }catch (error){
    return next(error)
  }
})
