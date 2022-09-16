const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res, next) => {
  let retVal = {
    status: 200,
  }

  try {
    const connection = await db
    const query = `SELECT * FROM privilege`
    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    next(err)
  }
})

// addUserPrivilege (privilege id nya array )

module.exports = router
