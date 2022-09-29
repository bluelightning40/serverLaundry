const dayjs = require('dayjs')
const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { inputChecks, userNumberGenerator, throwError } = require('../helper')
const insertEmployeeSQL = `INSERT INTO employee (employee_id, employee_name, employee_username, employee_password, employee_create_id, employee_create_ip, employee_update_id, employee_update_ip, employee_note, employee_status) VALUES (?,?,?,?,?,?,?,?,?,?)`
const updateEmployeeSQL = `UPDATE employee SET employee_name=?, employee_password=?, employee_update_ip=?, employee_update_date=?, employee_note=?, employee_status=? WHERE employee_id=?`
const insertEmployeePrivilegeSQL = `INSERT INTO employee_privilege (employee_privilege_id, employee_privilege_create_id, employee_privilege_create_ip, employee_privilege_update_id, employee_privilege_update_ip, employee_privilege_note, employee_privilege_status, FK_employee_id, FK_privilege_id) VALUES (?,?,?,?,?,?,?,?,?)`

// Employee Login
router.post('/login', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['username', 'password']

  try {
    inputChecks(requiredInputs, req.body, true)

    const { username, password } = req.body

    const connection = await db

    let query = `SELECT * FROM employee WHERE employee_username = '${username}'`
    const [employeeResult] = await connection.query(query)
    if (employeeResult.length === 0) {
      throwError(404, 'Username tidak terdaftar')
    }
    const employee = employeeResult[0]
    const isValidPass = await bcrypt.compare(
      password,
      employee.employee_password
    )
    if (!isValidPass) throwError(400, 'Password salah')

    // TODO: Update Table User Login
    retVal.data = employee
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

// Get Employee
router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const connection = await db
    const query = `SELECT * FROM employee ${
      req.params.id ? `where employee_id = '${req.params.id}'` : ''
    }`
    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

// Insert Employee
router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 201,
  }
  const requiredInputs = [
    'name',
    'username',
    'password',
    'status',
    'privileges',
  ]

  const connection = await db
  try {
    inputChecks(requiredInputs, req.body)

    const { name, username, password, notes, status, privileges } = req.body
    const create_ip = req.socket.localAddress

    const [employees] = await connection.query(
      `SELECT * FROM employee where employee_username = '${username}'`
    )
    if (employees.length !== 0) {
      // Jika username sudah digunakan
      throwError(400, 'Username sudah digunakan')
    }

    // Jika unique, create user
    await connection.beginTransaction()
    const {
      id: employeeId,
      createId: employeeCreateId,
      updateId: employeeUpdateId,
    } = await userNumberGenerator(connection, 'employee', 'E')
    await connection.query(insertEmployeeSQL, [
      employeeId,
      name,
      username,
      await bcrypt.hash(password, 10),
      employeeCreateId,
      create_ip,
      employeeUpdateId,
      create_ip,
      notes ? notes : null,
      status,
    ])

    const userPrivileges = []
    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]
      const [rows] = await connection.query(
        `SELECT * FROM privilege WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid.', true)
      }
      userPrivileges.push({ id: privilege, name: rows[0].privilege_name })
    }

    // Insert user_privilege
    let dateString = dayjs().format('DDMMYY')
    let query = `SELECT * FROM employee_privilege WHERE employee_privilege_id like 'EP${dateString}%'`
    const [rows] = await connection.query(query)

    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]

      // Creating IDs
      const employeeNumber = `${dateString}${`${rows.length + 1 + i}`.padStart(
        3,
        '0'
      )}`
      const employeePrivilegeid = `EP${employeeNumber}`
      const employeePrivilegeCreateId = `EPC${employeeNumber}`
      const employeePrivilegeUpdateId = `EPU${employeeNumber}`

      await connection.query(insertEmployeePrivilegeSQL, [
        employeePrivilegeid,
        employeePrivilegeCreateId,
        create_ip,
        employeePrivilegeUpdateId,
        create_ip,
        null,
        1,
        employeeId,
        privilege,
      ])
    }
    await connection.commit()

    retVal.data = {
      id: employeeId,
      name,
      username,
      user_notes: notes,
      user_status: status,
      privileges: userPrivileges,
      created_date: new Date(),
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    await connection.rollback()
    return next(error)
  }
})

// Update Employee
router.put('/update/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name', 'status', 'privileges']

  // employee_name =?,
  //   employee_password =?,
  //   employee_update_ip =?,
  //   employee_update_date =?,
  //   employee_note =?,
  //   employee_status =?

  const connection = await db
  try {
    inputChecks(requiredInputs, req.body)

    const { name, password, notes, status, privileges } = req.body
    const ip = req.socket.localAddress

    await connection.beginTransaction()
    const [employee] = await connection.query(
      `SELECT * FROM employee where employee_id = '${req.params.id}'`
    )
    if (employee.length === 0) {
      // Jika id salah
      throwError(404, 'ID tidak ditemukan')
    }

    await connection.query(updateEmployeeSQL, [
      name,
      password
        ? await bcrypt.hash(password, 10)
        : employee[0].employee_password,
      ip,
      new Date(),
      notes ? notes : employee[0].employee_note,
      status,
      req.params.id,
    ])

    // Check privilege id
    const userPrivileges = []
    // Check if privilege_id is present
    const [employeePrivilegesQuery] = await connection.query(
      `SELECT * FROM employee_privilege WHERE FK_employee_id='${req.params.id}'`
    )

    const employeePrivileges = employeePrivilegesQuery.map((privilege) => {
      return {
        id: privilege.employee_privilege_id,
        privilegeId: privilege.FK_privilege_id,
        status: privilege.employee_privilege_status,
      }
    })

    for (let i = 0; i < employeePrivileges.length; i++) {
      const employeePrivilege = employeePrivileges[i]

      const found = privileges.find(
        (privilege) => privilege === employeePrivilege.privilegeId
      )
      if (!found)
        userPrivileges.push({
          id: employeePrivilege.privilegeId,
          type: 'delete',
        })
    }

    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i]
      const [rows] = await connection.query(
        `SELECT * FROM privilege WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid.', true)
      }

      let actionType = 'insert'

      const found = employeePrivileges.find(
        (employeePrivilege) => employeePrivilege.privilegeId == privilege
      )

      if (found) {
        actionType = '-'
        if (found.status === 0) {
          actionType = 'update'
        }
      }

      userPrivileges.push({
        id: privilege,
        type: actionType,
      })
    }

    // Update or insert employee_privilege
    for (let i = 0; i < userPrivileges.length; i++) {
      const privilege = userPrivileges[i]
      if (privilege.type === 'insert') {
        let dateString = dayjs().format('DDMMYY')
        let query = `SELECT * FROM employee_privilege WHERE employee_privilege_id like 'EP${dateString}%'`
        const [rows] = await connection.query(query)

        // Creating IDs
        const employeeNumber = `${dateString}${`${rows.length + 1}`.padStart(
          3,
          '0'
        )}`
        const employeePrivilegeid = `EP${employeeNumber}`
        const employeePrivilegeCreateId = `EPC${employeeNumber}`
        const employeePrivilegeUpdateId = `EPU${employeeNumber}`

        await connection.query(insertEmployeePrivilegeSQL, [
          employeePrivilegeid,
          employeePrivilegeCreateId,
          ip,
          employeePrivilegeUpdateId,
          ip,
          null,
          1,
          req.params.id,
          privilege.id,
        ])
      } else if (privilege.type === 'update') {
        await connection.query(
          `UPDATE employee_privilege SET employee_privilege_status = 1, employee_privilege_update_date=? WHERE FK_privilege_id = '${privilege.id}'`,
          new Date()
        )
      } else if (privilege.type === 'delete') {
        await connection.query(
          `UPDATE employee_privilege SET employee_privilege_status = 0, employee_privilege_update_date=? WHERE FK_privilege_id = '${privilege.id}'`,
          new Date()
        )
      }
    }

    const retPrivileges = []

    for (let i = 0; i < userPrivileges.length; i++) {
      const privilege = userPrivileges[i]
      if (privilege.type != 'delete') {
        const [rows] = await connection.query(
          `SELECT * FROM privilege WHERE privilege_id = '${privilege.id}'`
        )
        retPrivileges.push({
          id: rows[0].privilege_id,
          name: rows[0].privilege_name,
        })
      }
    }
    await connection.commit()

    retVal.data = {
      id: req.params.id,
      name,
      user_notes: notes,
      user_status: status,
      privileges: retPrivileges,
      updated_date: new Date(),
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    await connection.rollback()
    return next(error)
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const connection = await db

    await connection.query(
      `UPDATE employee SET employee_status = 0 WHERE employee_id = '${req.params.id}'`
    )

    const [deletedEmployee] = await connection.query(
      `SELECT * FROM employee WHERE employee_id = '${req.params.id}'`
    )

    retVal.data = deletedEmployee[0]

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
