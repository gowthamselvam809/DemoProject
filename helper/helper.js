const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "trainingdb",
  });


  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});

const selectData = (data, callBack)=>{
    const select = data.select;
    const table = data.table;
    const condition = data.condition;

    const query = `SELECT ${select} FROM ${table} WHERE ${condition}`

    con.query(query,(err,result)=>{
        if(err){
            throw err;
        }else{
            callBack(result);
        }
    })
}

const insertData = (data,callBack)=>{
    const table = data.table;
    const columns = data.columns;
    const values = data.values;

    const query = `INSERT INTO ${table}(${columns}) VALUES(${values})`;

    con.query(query, (err, result)=>{
        if(err){
            throw err;
        }else{
            callBack(1);
        }
    })
}


module.exports = {selectData,insertData}