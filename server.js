const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const controller = require('./controller/controller.js')

const app = express();

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}))

app.engine('html',require('ejs').renderFile);

app.get('/admin',(req,res)=>{
    controller.admin(req,res);
})

app.post('/login',(req,res)=>{
    controller.adminLogin(req,res);
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard.html')
})

app.listen(4000, ()=>{
    console.log('server listening on port 4000')
})