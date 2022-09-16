const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
// const bcrypt = require('bcryptjs')
const { inputChecks, userNumberGenerator, throwError } = require('../helper')
const insertUserSQL = `INSERT INTO user (user_id, user_name, user_username, user_password, user_create_id, user_create_ip, user_update_id, user_update_ip, user_note, user_status) VALUES (?,?,?,?,?,?,?,?,?)`

router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name', 'username', 'password', 'status']

  try {
    inputChecks(requiredInputs, req.body)

    const { name, username, password, notes, status } = req.body
    const create_ip = req.socket.localAddress

    const connection = await db
    const [users] = await connection.query(
      `SELECT * FROM user where user_username = '${username}'`
    )
    if (users.length === 0) {
      // Jika username sudah digunakan
      throwError(400, 'Username sudah digunakan')
    }

    // Jika unique, create user
    const { id, createId, updateId } = await userNumberGenerator('user', 'U')
    await connection.query(insertUserSQL, [
      id,
      name,
      username,
      password,
      createId,
      create_ip,
      updateId,
      create_ip,
      notes ? notes : null,
      status,
    ])

    // TODO: Update Table User Login
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
