const express = require('express')
const router = express.Router()
const db = require('../db')

const insertPrivilegeSQL = `INSERT INTO privilege (privilege_id, privilege_name, privilege_create_id, privilege_create_ip, privilege_update_id, privilege_update_ip, privilege_note, privilege_status) VALUES (?,?,?,?,?,?,?,?)`

router.post('/addPrivilege', async (req, res) => {
  let status = 200
  let retVal = {}

  const username = req.params.username
  try {
    const connection = await db
    const query = `SELECT * FROM user_privilege where `
    const [rows] = await connection.query(query)
  } catch (err) {
    console.error(err)
    status = 500
    retVal.message = 'Something went wrong'
  } finally {
    res.status(status).json(retVal)
  }
})

// addUserPrivilege (privilege id nya array )

module.exports = router
