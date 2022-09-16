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
  const requiredInputs = [
    'name',
    'username',
    'password',
    'status',
    'privileges',
  ]

  try {
    inputChecks(requiredInputs, req.body)

    const { name, username, password, notes, status, privileges } = req.body
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
    const { id, createId, updateId } = await userNumberGenerator(
      connection,
      'user',
      'U'
    )
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

    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]
      const [rows] = await connection.query(
        `SELECT * FROM privileges WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid.', true)
      }
    }

    // Insert user_privilege

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
