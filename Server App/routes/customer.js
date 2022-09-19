const express = require('express')
const router = express.Router()
const db = require('../db')
const { inputChecks, userNumberGenerator } = require('../helper')

const insertCustomerSQL = `INSERT INTO customer 
(customer_id, customer_name, customer_phone_number, customer_email, 
  customer_address, customer_create_id, customer_create_ip, 
  customer_update_id, customer_update_ip, customer_note, 
  customer_status) VALUES (?,?,?,?,?,?,?,?,?,?,?)
`

const updateCustomerSQL = `UPDATE customer SET customer_name=?, customer_phone_number=?, customer_email=?, customer_address=?, customer_update_ip=?, customer_update_date=?, customer_note=?,customer_status=? WHERE customer_id=?`

router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  try {
    const connection = await db
    const query = `SELECT * FROM customer ${
      req.params.id ? `where customer_id = '${req.params.id}'` : ''
    }`
    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/create', async (req, res, next) => {
  // var date = date_ob.getDate();
  // var month = date_ob.getMonth()+1;
  // var year = date_ob.getYear() % 100;

  // const phone_number = req.body.phone_number;
  // const email = req.body.email;
  // const address = req.body.address;
  // const notes = req.body.notes;
  // const status = req.body.status;

  // pool.getConnection((err,conn)=>{
  //   conn.query(`select * from customer where customer_id LIKE '%${id}'`, function(req,result){
  //     if(err) return res.status(500).send(err)
  //     else{
  //       count_id = result.length +1;

  //       if(count_id<10){
  //         id = id+'000'+count_id;
  //         create_id = create_id+'00'+count_id;
  //       }
  //       else if(count_id<100){
  //         id = id+'00'+count_id;
  //         create_id = create_id+'0'+count_id;
  //       }
  //       else{
  //         id=id+'0'+count_id;
  //         create_id=create_id+count_id;
  //       }

  //       var sql = `INSERT INTO CUSTOMER (customer_id,customer_name,customer_phone_number,customer_email,customer_address,customer_create_id, customer_create_ip, customer_notes,customer_status) VALUES ('${id}','${name}','${phone_number}','${email}','${address}','${create_id}','${create_ip}','${notes}','${status}')`

  //       pool.getConnection((err,conn)=>{
  //         conn.query(sql,function(){
  //           if(err) return res.status(500).send(err)
  //           else{
  //             return res.status(200).send(id);
  //           }
  //         })
  //         conn.release();
  //       })
  //     }
  //   })
  //   conn.release();
  // })

  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name', 'phone_number', 'email', 'address', 'status']

  try {
    inputChecks(requiredInputs, req.body)

    // let dateString = dayjs().format('DDMMYY')

    // // Calculating User number
    // let query = `SELECT * FROM customer WHERE customer_id like 'C${dateString}%'`
    // const [customers] = await connection.query(query)
    // // Creating IDs
    // const id = `C${dateString}${`${customers.length + 1}`.padStart(4, '0')}`
    // const create_id = `CC${dateString}${`${customers.length + 1}`.padStart(
    //   3,
    //   '0'
    // )}`
    const { name, phone_number, email, address, notes, status } = req.body
    const create_ip = req.socket.localAddress

    const connection = await db
    const { id, createId, updateId } = await userNumberGenerator(
      connection,
      'customer',
      'C'
    )

    // Inserting
    await connection.query(insertCustomerSQL, [
      id,
      name,
      phone_number,
      email,
      address,
      createId,
      create_ip,
      updateId,
      create_ip,
      notes ? notes : null,
      status,
    ])

    // Select created customer for return value
    const [createdCustomer] = await connection.query(
      `select * from customer where customer_id='${id}'`
    )

    retVal.data = {
      id,
      name,
      phone_number,
      email,
      address,
      createId,
      create_date: createdCustomer[0].customer_create_date,
      create_ip,
      notes: notes ? notes : null,
      status: status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

router.post('/update/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name', 'phone_number', 'email', 'address', 'status']

  try {
    inputChecks(requiredInputs, req.body)

    const { name, phone_number, email, address, notes, status } = req.body
    const ip = req.socket.localAddress

    const connection = await db

    const [oldCustomer] = await connection.query(
      `SELECT * FROM customer WHERE customer_id=?`,
      req.params.id
    )

    // updating
    await connection.query(updateCustomerSQL, [
      name,
      phone_number,
      email,
      address,
      ip,
      new Date(),
      notes ? notes : oldCustomer.customer_note,
      status,
      req.params.id,
    ])

    retVal.data = {
      id: req.params.id,
      name,
      phone_number,
      email,
      address,
      ip,
      updated_date: new Date(),
      notes: notes ? notes : oldCustomer.customer_note,
      status: status,
    }

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
