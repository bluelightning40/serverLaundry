const express = require('express')
// const multer = require('multer');
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const { inputChecks } = require('./helper')

const cors = require('cors')
// const { inputChecks } = require('./helper')
require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

app.post('/api/test', async (req, res, next) => {
  const requiredInputs = ['name']
  try {
    inputChecks(requiredInputs, req.body)
    return res.status(200).send('Welcome ' + req.body.name)
  } catch (error) {
    return next(error)
  }
})

app.listen(3000, () => console.log(`Running...`))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || 500
  const message = err.customMessage || 'Something went wrong'

  return res.status(status).json({ status, message })
})
