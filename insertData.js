const express = require('express')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express();

app.engine('html', require('ejs').renderFile);
// app.use('view engine', 'html')
app.use(bodyParser.urlencoded({extended:true}));


const userDataFilePath = path.join(__dirname, 'userData.json')

const data = fs.readFileSync(userDataFilePath);
const userData = JSON.parse(data)

var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'admin',
    database :'trainingdb'
})

con.connect((err)=>{
    if(err) throw err;
    console.log("Database connected....")

    for(let user of userData){
        const query = 'UPDATE  USER_INFOS SET user_password = ?'

        const values =[
            user.userpassword,
        ]
        con.query(query,values,(err,result)=>{
            if(err) throw err;
            else console.log('inserted...')
        })
    }

})

