const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const pool = mysql.createPool({
  host:"localhost",
  database:"db_laundry",
  user:"root",
  password:""
});

router.get("/api/list-customer", (req,res) => {
  pool.getConnection((err,conn)=>{
    conn.query(`select * from customer`, (err,result)=>{
      if(err) res.status(500).send(err)
      else{
        res.status(200).send(result);
      }
    })
    conn.release();
  })
});

module.exports = router;
