const dayjs = require('dayjs')
const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
// const bcrypt = require('bcryptjs')
const { inputChecks, userNumberGenerator, throwError } = require('../helper')
const insertUserSQL = `INSERT INTO user (user_id, user_name, user_username, user_password, user_create_id, user_create_ip, user_update_id, user_update_ip, user_note, user_status) VALUES (?,?,?,?,?,?,?,?,?)`
const insertUserPrivilegeSQL = `INSERT INTO user_privilege (user_privilege_id, user_privilege_create_id, user_privilege_create_ip, user_privilege_update_id, user_privilege_update_ip, user_privilege_note, user_privilege_status, FK_user_id, FK_privilege_id) VALUES (?,?,?,?,?,?,?,?,?)`

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
    const { userId, userCreateId, userUpdateId } = await userNumberGenerator(
      connection,
      'user',
      'U'
    )
    await connection.query(insertUserSQL, [
      userId,
      name,
      username,
      password,
      userCreateId,
      create_ip,
      userUpdateId,
      create_ip,
      notes ? notes : null,
      status,
    ])

    const userPrivileges = []
    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]
      const [rows] = await connection.query(
        `SELECT * FROM privileges WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid.', true)
      }
      userPrivileges.push({ id: privilege, name: rows[0].privilege_name })
    }

    // Insert user_privilege
    let dateString = dayjs().format('DDMMYY')
    let query = `SELECT * FROM user_privilege WHERE customer_id like 'UP${dateString}%'`
    const [rows] = await connection.query(query)

    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]

      // Creating IDs
      const userNumber = `${dateString}${`${rows.length + 1 + i}`.padStart(
        4,
        '0'
      )}`
      const userPrivilegeid = `UP${userNumber}`
      const userPrivilegeCreateId = `UPC${userNumber}`
      const userPrivilegeUpdateId = `UPU${userNumber}`

      await connection.query(insertUserPrivilegeSQL, [
        userPrivilegeid,
        userPrivilegeCreateId,
        create_ip,
        userPrivilegeUpdateId,
        create_ip,
        null,
        1,
        userId,
        privilege,
      ])
    }

    retVal.data = {
      id: userId,
      name,
      username,
      user_notes: notes,
      user_status: status,
      privileges: userPrivileges,
      created_date: new Date(),
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
