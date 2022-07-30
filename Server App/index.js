const express = require('express');

const app = express();

app.get("/hello-world", (req,res)=>{
  return res.status(200).send("Hello World !!!");
});

app.listen(3000,() => console.log("API SERVER IS RUNNING ... "));
