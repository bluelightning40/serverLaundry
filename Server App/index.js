const express = require('express');
const mysql = require('mysql');

const app = express();

// const customer = require("./routes/customer");
// const product = require("./routes/product");
// const service = require("./routes/service");
// const transaction = require("./routes/transaction");
// const user = require("./routes/user");
//
// app.use("/",customer);
// app.use("/",product);
// app.use("/",service);
// app.use("/",transaction);
// app.use("/",user);

const pool = mysql.createPool({
  host:"localhost",
  database:"db_laundry",
  user:"root",
  password:""
});

app.get("/hello-world", (req,res)=>{
  return res.status(200).send("Hello World !!!");
});

//========== Customer ==========

app.get("/api/list-customer", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from customer`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});

//========== Product ==========

app.get("/api/list-product", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from product where product_category='produk'`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});

//========== Service ==========

app.get("/api/list-service", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from product where product_category='jasa'`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});

//========== Transaction ==========

app.get("/api/list-h-trans", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from h_trans`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});

app.get("/api/list-d-trans", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from d_trans`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});
//========== User ==========

app.get("/api/list-user", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from user`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result);
      }
    })
    conn.release();
  })
});

// ===========================================================================================

app.listen(3000,() => console.log(`API SERVER IS RUNNING ...  Listening to Port 3000!`));
