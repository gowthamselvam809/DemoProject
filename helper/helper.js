const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "electricity",
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

const fetchData = (data, callBack) =>{
    const select = data.select;
    const table = data.table;
    
    const query = `SELECT ${select} FROM ${table}`

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

const sessionValidation = (data,callBack)=>{
    const user_select = data.user_select;
    const user_table_name = data.user_table_name;
    const condition_user = data.condition_user;
    const session_select = data.session_select;
    const session_table_name = data.session_table_name;
    const condition_session = data.condition_session;

    const getQuery = `SELECT ${user_select} FROM ${user_table_name} WHERE ${condition_user} IN (SELECT ${session_select} FROM ${session_table_name} WHERE ${condition_session})`

    con.query(getQuery,(getErr, getResult)=>{
        if(getErr){
            throw getErr;
        }else{
            callBack(getResult);
        }
    })
}

const deleteRowData = (data, callBack)=>{
    const table = data.table;
    const condition = data.condition;

    const delQuery = `DELETE FROM ${table} WHERE ${condition};`

    con.query(delQuery, (err,result)=>{
        if(err){
            throw err;
        }else{
            callBack(1)
        }
    })
}

const updateData = (data,callBack)=>{
    const table = data.table;
    const columns = data.columns;
    const condition = data.condition;
    const updateQuery = `UPDATE ${table} SET ${columns} WHERE ${condition}`
    con.query(updateQuery, (err,result)=>{
        if(err){
            throw err;
        }else{
            callBack(1);
        }
    })
}


module.exports = {selectData,insertData,sessionValidation,fetchData,deleteRowData,updateData}