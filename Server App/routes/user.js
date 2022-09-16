const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { inputChecks, throwError } = require('../helper')

router.post('/login', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['username', 'password']

  try {
    inputChecks(requiredInputs, req.body, true)

    const { username, password } = req.body

    const connection = await db

    let query = `SELECT * FROM user WHERE user_username = '${username}'`
    const [userResult] = await connection.query(query)
    if (userResult.length === 0) {
      throwError(404, 'User tidak terdaftar')
    }
    const user = userResult[0]
    const isValidPass = await bcrypt.compare(password, user.user_password)
    if (!isValidPass) throwError(400, 'Password salah')

    // TODO: Update Table User Login
    retVal.data = user
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
