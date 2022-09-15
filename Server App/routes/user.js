const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { inputChecks } = require('../helper')
// const insertUserSQL = `INSERT INTO user (user_id, user_name, user_password, user_create_id, user_create_ip, user_update_id, user_update_ip, user_note, user_status) VALUES (?,?,?,?,?,?,?,?,?)`

router.post('/login', async (req, res, next) => {
  let statusCode = 200
  let retVal = {}
  const requiredInputs = ['username', 'password']

  try {
    inputChecks(requiredInputs, req.body, true)

    const { username, password } = req.body

    const connection = await db

    let query = `SELECT * FROM user WHERE user_name = '${username}'`
    const [userResult] = await connection.query(query)
    if (userResult.length === 0) {
      throw { status: 404, customMessage: 'User tidak terdaftar' }
    }
    const user = userResult[0]
    const isValidPass = await bcrypt.compare(password, user.user_password)
    if (!isValidPass) throw { status: 400, customMessage: 'Password salah' }

    // TODO: Update Table User Login
    retVal.status = statusCode
    retVal.data = user
    return res.status(statusCode).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
