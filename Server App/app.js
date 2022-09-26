const express = require('express')
// const multer = require('multer');
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const cors = require('cors')
const { inputChecks } = require('./helper')
require('dotenv').config()
// PLANETSCALE CONNECT
// const mysql = require('mysql2')
// import mysql from 'mysql2/promise'
// const connection = await mysql.createConnection(process.env.DATABASE_URL)
// console.log('Connected to PlanetScale!')
// [END] PLANETSCALE CONNECT

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use('/uploads', express.static('uploads'))

app.use(cors())

const customerRouter = require('./routes/customer')
app.use('/api/customer', customerRouter)

const employeeRouter = require('./routes/employee')
app.use('/api/employee', employeeRouter)

const privilegeRouter = require('./routes/privilege')
app.use('/api/privilege', privilegeRouter)

const productRouter = require('./routes/product')
app.use('/api/product', productRouter)

const promoRouter = require('./routes/promo')
app.use('/api/promo', promoRouter)

const htransRouter = require('./routes/h_trans')
app.use('/api/transaction/header', htransRouter)

const dtransRouter = require('./routes/d_trans')
app.use('/api/transaction/detail', dtransRouter)

app.get('/api/test', (req, res) => {
  // const name = 'yosua'
  //   name += 'hellooo'
  return res
    .status(200)
    .send(inputChecks(['username', 'password'], req.body, true))
})

app.listen(3000, () =>
  console.log(`API SERVER IS RUNNING...  Listening to Port 3000!`)
)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || 500
  const message = err.customMessage || 'Something went wrong'

  return res.status(status).json({ status, message })
})
