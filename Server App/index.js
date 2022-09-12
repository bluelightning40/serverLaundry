const express = require('express');
const mysql = require('mysql');
var multer = require('multer');
var bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let date_ob = new Date();

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

app.use(bodyParser.urlencoded({extended:false}));
app.use('/uploads', express.static('uploads'));

app.use(cors());

const pool = mysql.createPool({
  host:"localhost",
  database:"db_laundry",
  user:"root",
  password:""
});

app.get("/hello-world", (req,res)=>{
  return res.status(200).send("Hello World !!!");
});

var filename ="";

//Set Storage Engine
const storage=multer.diskStorage({
  destination:'./public/uploads',
  filename:function(req,file,cb){
    filename = file.originalname;
    cb(null,filename);
  }
});

let upload = multer({
  storage: storage,
  fileFilter:function(req,file,cb){
    checkFileType(file,cb);
  }
});

function checkFileType(file,cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype=filetypes.test(file.mimetype);
  if(mimetype&&extname){
    return cb(null,true);
  }
  else{
    cb('Error: Image Only !!');
  }
}

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

app.post("/api/addNewCustomer", (req,res) =>{

  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var id = "C";
  var name = req.body.name;
  var phone_number = req.body.phone_number;
  var email = req.body.email;
  var address = req.body.address;
  var create_id = "CC";
  var create_ip = req.socket.localAddress;
  var notes = req.body.notes;
  var status = req.body.status;

  var count_id = 0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from customer where customer_id LIKE '%${id}'`, function(req,result){
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length +1;

        if(count_id<10){
          id = id+'000'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'00'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+'0'+count_id;
          create_id=create_id+count_id;
        }

        var sql = `INSERT INTO CUSTOMER (customer_id,customer_name,customer_phone_number,customer_email,customer_address,customer_create_id, customer_create_ip, customer_notes,customer_status) VALUES ('${id}','${name}','${phone_number}','${email}','${address}','${create_id}','${create_ip}','${notes}','${status}')`

        pool.getConnection((err,conn)=>{
          conn.query(sql,function(req,result){
            if(err) return res.status(500).send(err)
            else{
              return res.status(200).send(id);
            }
          })
          conn.release();
        })
      }
    })
    conn.release();
  })

});

//========== Privilege ==========

app.post("/api/addUserPrivilege", (req,res)=>{

  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var id = "UP";
  var create_id = "UPC";
  var create_ip = req.socket.localAddress;
  var notes = req.body.notes;
  var status = req.body.status;
  var user_id = req.body.user_id;
  var privilege_id = req.body.privilege_id;

  var count_id = 0;


  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`SELECT * FROM user_privilege WHERE user_privilege_id LIKE '%${id}%'`, function(req,result){
      count_id = result.length +1;

      if(count_id<10){
        id = id+'00'+count_id;
        create_id = create_id+'0'+count_id;
      }
      else if(count_id<100){
        id = id+'0'+count_id;
        create_id = create_id+count_id;
      }
      else{
        id=id+count_id;
        create_id=create_id+count_id;
      }

      var sql = `INSERT INTO user_privilege (user_privilege_id,user_privilege_create_id,user_privilege_create_ip,user_privilege_notes, user_privilege_status, FK_user_id, FK_privilege_id) VALUES ('${id}','${create_id}','${create_ip}','${notes}','${status}','${user_id}','${privilege_id}')`;

      pool.getConnection((err,conn)=>{
        conn.query(sql,function(req,result){
          if(err) return res.status(500).send(err)
          else{
            return res.status(200).send(id);
          }
        })
        conn.release();
      })
    })
    conn.release();
  })
});

app.get("/api/userPrivilege", (req,res)=>{
  var username = req.query.username;

  pool.getConnection((err,conn)=>{
    conn.query(`select U.user_name, P.privilege_name from user U, user_privilege UP, privilege P where U.user_name = "${username}" AND UP.FK_user_id = U.user_id AND UP.FK_privilege_id = P.privilege_id`, (err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        return res.status(200).send(result)
      }
    })
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

app.post("/api/addNewProduct", (req,res) => {
  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var name = req.body.name;
  var price = req.body.price;
  var stock = req.body.stock;
  var category = "produk";
  var create_id = "PC";
  var id = "P";
  var ip = req.socket.localAddress;
  var notes = req.body.notes;
  var status = req.body.status;

  var count_id = 0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from product where product_id like "%${id}%"`,(err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length + 1;

        if(count_id<10){
          id = id+'000'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'00'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+'0'+count_id;
          create_id=create_id+count_id;
        }

        var sql = `INSERT INTO PRODUCT (product_id,product_name,product_price,product_stock,product_category,product_create_id, product_create_ip, product_notes,product_status) VALUES ('${id}','${name}','${price}','${stock}','${category}','${create_id}','${ip}','${notes}','${status}')`

        pool.getConnection((err,conn)=>{
          conn.query(sql,function(req,result){
            if(err) return res.status(500).send(err)
            else{
              return res.status(200).send(id);
            }
          })
          conn.release();
        })
      }
    })
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

app.post("/api/addNewService", (req,res) => {
  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var name = req.body.name;
  var price = req.body.price;
  var stock = req.body.stock;
  var category = "jasa";
  var create_id = "PC";
  var id = "P";
  var ip = req.socket.localAddress;
  var notes = req.body.notes;
  var status = req.body.status;

  var count_id = 0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from product where product_id like "%${id}%"`,(err,result)=>{
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length + 1;

        console.log(result.length);

        if(count_id<10){
          id = id+'000'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'00'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+'0'+count_id;
          create_id=create_id+count_id;
        }

        var sql = `INSERT INTO PRODUCT (product_id,product_name,product_price,product_stock,product_category,product_create_id, product_create_ip, product_notes,product_status) VALUES ('${id}','${name}','${price}','${stock}','${category}','${create_id}','${ip}','${notes}','${status}')`

        pool.getConnection((err,conn)=>{
          conn.query(sql,function(req,result){
            if(err) return res.status(500).send(err)
            else{
              return res.status(200).send(id);
            }
          })
          conn.release();
        })
      }
    })
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

app.post('/api/addNewTransaction', function(req,res){

  // h_trans data
  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var id = "T";
  var estimation = req.body.estimation;
  var total_trans = req.body.total_trans;
  var create_id = "TC";
  var create_ip = req.socket.localAddress;
  var notes= req.body.notes;
  var status = req.body.status;
  var customer_id = req.body.customer_id;

  var count_id=0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from h_trans where h_trans_id LIKE '%${id}%'`, function(req,result){
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length+1;

        if(count_id<10){
          id = id+'000'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'00'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+'0'+count_id;
          create_id=create_id+count_id;
        }

        var sql = `INSERT INTO h_trans (h_trans_id,h_trans_estimation,h_trans_total_trans,h_trans_create_id,h_trans_create_ip,h_trans_notes,h_trans_status,FK_customer_id) VALUES ("${id}","${estimation}","${total_trans}","${create_id}","${create_ip}","${notes}","${status}","${customer_id}")`

        pool.getConnection((err,conn)=>{
          conn.query(sql,function(req,result){
            if(err) return res.status(500).send(err)
            else{
              return res.status(200).send(id);
            }
          })
          conn.release();
        })
      }
    })
    conn.release();
  })
});

app.post('/api/addNewTransactionDetail', function(req,res){

  // d_trans data
  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var id = "DT";
  var h_product_id = req.body.h_product_id;
  var h_trans_id = req.body.h_trans_id;
  var status = req.body.status;
  var notes = req.body.notes;
  var create_id = "DC";
  var create_ip = req.socket.localAddress;

  var count_id=0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from d_trans where d_trans_id LIKE '%${id}%'`, function(req,result){
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length+1;

        if(count_id<10){
          id = id+'00'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'0'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+count_id;
          create_id=create_id+count_id;
        }

        var sql = `INSERT INTO d_trans (d_trans_id,d_trans_create_id,d_trans_create_ip,d_trans_note,d_trans_status,FK_h_product_id,FK_h_trans_id) VALUES ("${id}","${create_id}","${create_ip}","${notes}","${status}","${h_product_id}","${h_trans_id}")`;

        pool.getConnection((err,conn)=>{
          conn.query(sql,function(req,result){
            if(err) return res.status(500).send(err)
            else{
              return res.status(200).send(id);
            }
          })
          conn.release();
        })
      }
    })
    conn.release();
  })
});

//untested
app.post('/api/uploadTransactionImage', upload.single('uploaded-image'), function(req,res){
  var image_type = req.query.image_type;
  var image_notes = req.body.image_notes;
  var image_name = filename;
  var d_trans_id = req.query.d_trans_id;

  if(image_type == 'main'){
    var sql = `UPDATE 'd_trans' set d_trans_main_photo = '${image_name}', d_trans_main_note = '${image_notes}' where d_trans_id = '${d_trans_id}'`;

    pool.getConnection((err,conn)=>{
      conn.query(sql,function(req,result){
        if(err) return res.status(500).send(err)
        else{
          return res.status(200).send(result);
        }
      })
      conn.release();
    })
  }
  else if(image_type == 'top'){
    var sql = `UPDATE 'd_trans' set d_trans_top_photo = '${image_name}', d_trans_top_note = '${image_notes}' where d_trans_id = '${d_trans_id}'`;

    pool.getConnection((err,conn)=>{
      conn.query(sql,function(req,result){
        if(err) return res.status(500).send(err)
        else{
          return res.status(200).send(result);
        }
      })
      conn.release();
    })
  }
  else if(image_type == 'below'){
    var sql = `UPDATE 'd_trans' set d_trans_below_photo = '${image_name}', d_trans_below_note = '${image_notes}' where d_trans_id = '${d_trans_id}'`;

    pool.getConnection((err,conn)=>{
      conn.query(sql,function(req,result){
        if(err) return res.status(500).send(err)
        else{
          return res.status(200).send(result);
        }
      })
      conn.release();
    })
  }
  else if(image_type == 'left'){
    var sql = `UPDATE 'd_trans' set d_trans_left_photo = '${image_name}', d_trans_left_note = '${image_notes}' where d_trans_id = '${d_trans_id}'`;

    pool.getConnection((err,conn)=>{
      conn.query(sql,function(req,result){
        if(err) return res.status(500).send(err)
        else{
          return res.status(200).send(result);
        }
      })
      conn.release();
    })
  }
  else if(image_type == 'right'){
    var sql = `UPDATE 'd_trans' set d_trans_right_photo = '${image_name}', d_trans_right_note = '${image_notes}' where d_trans_id = '${d_trans_id}'`;

    pool.getConnection((err,conn)=>{
      conn.query(sql,function(req,result){
        if(err) return res.status(500).send(err)
        else{
          return res.status(200).send(result);
        }
      })
      conn.release();
    })
  }

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

app.post("/api/addNewUser", (req,res) =>{

  var date = date_ob.getDate();
  var month = date_ob.getMonth()+1;
  var year = date_ob.getYear() % 100;

  var id = "U";
  var name = req.body.name;
  var password = req.body.password;
  var create_id = "UC";
  var create_ip = req.socket.localAddress;
  var notes = req.body.notes;
  var status = req.body.status;

  var count_id = 0;

  if(date<10){
    id = id + '0' + date;
    create_id = create_id + '0' + date;
  }
  else{
    id = id+date;
    create_id = create_id+date;
  }

  if(month<10){
    id = id + '0' + month;
    create_id = create_id + '0' + month;
  }
  else{
    id = id+month;
    create_id = create_id+month;
  }

  if(year<10){
    id = id + '0' + year;
    create_id = create_id + '0' + year;
  }
  else{
    id = id+year;
    create_id = create_id+year;
  }

  pool.getConnection((err,conn)=>{
    conn.query(`select * from user where user_id LIKE '%${id}'`, function(req,result){
      if(err) return res.status(500).send(err)
      else{
        count_id = result.length +1;

        if(count_id<10){
          id = id+'000'+count_id;
          create_id = create_id+'00'+count_id;
        }
        else if(count_id<100){
          id = id+'00'+count_id;
          create_id = create_id+'0'+count_id;
        }
        else{
          id=id+'0'+count_id;
          create_id=create_id+count_id;
        }

        var hashedPassword = "";

        bcrypt.genSalt(10, (err,salt)=>{
          bcrypt.hash(password, salt,(err,hash)=>{
            if(err){
              console.log(err);
              return res.status(500).send(err);
            }
            else{
              hashedPassword = hash;

              if(hashedPassword!=""){
                var sql = `INSERT INTO USER (user_id,user_name,user_password,user_create_id,user_create_ip,user_notes, user_status) VALUES ('${id}','${name}','${hashedPassword}','${create_id}','${create_ip}','${notes}','${status}')`

                pool.getConnection((err,conn)=>{
                  conn.query(sql,function(req,result){
                    if(err) return res.status(500).send(err)
                    else{
                      return res.status(200).send(id);
                    }
                  })
                  conn.release();
                })
              }
              else{
                return res.status(500).send("Internal Server Error");
              }
            }
          });
        });
      }
    })
    conn.release();
  })

});

//========== Login User ==========

app.post("/api/loginUser", (req,res)=>{
  var username = req.query.username;
  var password = req.body.password;

  if(username!=undefined && password != undefined){
    pool.getConnection((err,conn)=>{
      conn.query(`select user_password,user_id from user where user_name = '${username}'`, (err,result)=>{
        if(err) res.status(500).send(err);
        else{
          if(result.length>0){
            var dbPassword = result[0].user_password;
            bcrypt.genSalt(10, (err,salt)=>{
              bcrypt.compare(password, dbPassword,(err,isMatch)=>{
                if(isMatch){

                  var date = date_ob.getDate();
                  var month = date_ob.getMonth()+1;
                  var year = date_ob.getYear() % 100;

                  var id = "L";
                  var user_id = result[0].user_id;
                  var ip = req.socket.localAddress;
                  var status = 1;
                  var create_id = "LC";

                  var count_id = 0;

                  if(date<10){
                    id = id + '0' + date;
                    create_id = create_id + '0' + date;
                  }
                  else{
                    id = id+date;
                    create_id = create_id+date;
                  }

                  if(month<10){
                    id = id + '0' + month;
                    create_id = create_id + '0' + month;
                  }
                  else{
                    id = id+month;
                    create_id = create_id+month;
                  }

                  if(year<10){
                    id = id + '0' + year;
                    create_id = create_id + '0' + year;
                  }
                  else{
                    id = id+year;
                    create_id = create_id+year;
                  }

                  pool.getConnection((err,conn)=>{
                    conn.query(`select * from user_login where login_id LIKE "%${id}%"`,(err,result)=>{
                      if(err) return res.status(500).send(err)
                      else{
                        count_id = result.length +1;

                        if(count_id<10){
                          id = id+'000'+count_id;
                          create_id = create_id+'00'+count_id;
                        }
                        else if(count_id<100){
                          id = id+'00'+count_id;
                          create_id = create_id+'0'+count_id;
                        }
                        else{
                          id=id+'0'+count_id;
                          create_id=create_id+count_id;
                        }

                        pool.getConnection((err,conn)=>{
                          conn.query(`SELECT * FROM user_login where FK_user_id = "${user_id}" and login_status = 1`, (err,result)=>{
                            if(err) res.status(500).send(err)
                            else{
                              console.log(result.length)
                              if(result.length == 0 ){
                                var sql = `INSERT INTO USER_LOGIN (login_id,FK_user_id,login_ip,login_status,login_create_id) VALUES ('${id}','${user_id}','${ip}','${status}','${create_id}')`

                                pool.getConnection((err,conn)=>{
                                  conn.query(sql,function(req,result){
                                    if(err) return res.status(500).send(err)
                                    else{
                                      return res.status(200).send(id);
                                    }
                                  })
                                  conn.release();
                                })
                              }
                              else{
                                return res.status(500).send("User Logged In !!");
                              }
                            }
                          })
                        })
                      }
                    });
                    conn.release();
                  });
                }
                else{
                  return res.status(500).send("Invalid Username or Password !!");
                }
              });
            });
          }
          else{
            return res.status(400).send("Username Invalid !!");
          }
        }
      })
      conn.release();
    })
  }
  else{
    return res.status(500).send("Username or Password Undefined!!");
  }
});

app.post("/api/logoutUser", (req,res)=>{
  var username = req.query.username;

  pool.getConnection((err,conn)=>{
    conn.query(`SELECT user_id FROM user WHERE user_name = '${username}'`, (err,result)=>{
      if(err) res.status(500).send(err);
      else{
        var date = date_ob.getDate();
        var month = date_ob.getMonth()+1;
        var year = date_ob.getYear() % 100;

        var user_id = result[0].user_id;

        var update_id = "LU";

        if(date<10){
          update_id = update_id + '0' + date;
        }
        else{
          update_id = update_id+date;
        }

        if(month<10){
          update_id = update_id + '0' + month;
        }
        else{
          update_id = update_id+month;
        }

        if(year<10){
          update_id = update_id + '0' + year;
        }
        else{
          update_id = update_id+year;
        }

        pool.getConnection((err,conn)=>{
          conn.query(`SELECT * FROM user_login WHERE login_update_id LIKE "%${update_id}"`,(err,result)=>{
            if(err) return res.status(500).send(err)
            else{
              var count_id =result.length+1;

              if(count_id<10){
                update_id = update_id+'00'+count_id;
              }
              else if(count_id<100){
                update_id = update_id+'0'+count_id;
              }
              else{
                update_id=update_id+count_id;
              }

              pool.getConnection((err,conn)=>{
                conn.query(`UPDATE user_login SET login_status=0, login_update_date = CURDATE(), login_update_id = "${update_id}" WHERE FK_user_id = "${user_id}"`,(err,result)=>{
                  if(err) return res.status(500).send(err)
                  else{
                    return res.status(200).send("user logged out !!");
                  }
                })
                conn.release();
              })
            }
          })
          conn.release();
        })
      }
    })
    conn.release();
  });
});

// ===========================================================================================

app.listen(3000,() => console.log(`API SERVER IS RUNNING ...  Listening to Port 3000!`));
