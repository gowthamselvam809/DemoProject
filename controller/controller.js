const helper = require('../helper/helper.js');
const {uuid} = require('uuidv4');

const admin = (req,res)=>{
    res.render('adminLogin.html')
}

const adminLogin = (req,res)=>{
    const phone = req.body.phone;
    const password = req.body.password;
    const data = {
        select:'*',
        table : 'user_info',
        condition : `user_phone = "${phone}" && user_password = "${password}"`
    };
    helper.selectData(data,(result)=>{
        if(result.length==1){
            if(result[0].user_type == 'admin'){
                const userid = result[0].user_id;
                console.log(userid)
                const data = {
                    select:'*',
                    table : 'session_info',
                    condition : `user_id = ${userid}`
                };
                helper.selectData(data,(session)=>{
                    if(session.length==1){
                        const session_id = session[0].session_id;
                        res.json({session:session_id,isAdmin:true,isValid : true});
                    }else{
                        if(session.length==0){
                            const sessionId = uuid();
                            console.log(sessionId)
                            const data = {
                                table : "session_info",
                                columns : "session_id , user_id",
                                values : `"${sessionId}" , ${result[0].user_id}`
                            }

                            helper.insertData(data,(insertResult)=>{
                                if(insertResult){
                                    res.send({session :sessionId,isAdmin:true,isValid:true})
                                }else{
                                    res.sendStatus(500);
                                }
                            });
                        }
                    }
                })
            }else{
                console.log('not a admin')
                res.json({isAdmin : false,isValid : true})
            }
            
        }else{
            console.log("invalid credentials")
            res.json({isValid : false});
        }
    })
}

const dashboard = (req,res)=>{
    const session_id = req.query.s;
    const data= {
        user_select : '*',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }
    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            if(result[0].user_type == 'admin'){
                res.render('dashboard.html')
            }else{
                res.render('adminLogin.html');
            }
        }else{
            res.render('adminLogin.html');
        }
    })
}

const billDetails = (req,res) =>{
    const session_id = req.body.session;
    const data= {
        user_select : '*',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }

    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            const user_id = result[0].user_id;
            if(result[0].user_type == 'admin'){
                const user_data = {
                    select : 'user_name,user_id,user_phone,user_address,block_status',
                    table : 'user_info'
                }
                helper.fetchData(user_data,(userResult)=>{
                    const billData = {
                        select : '*',
                        table : 'bill_data',
                    }
                    helper.fetchData(billData, (billResult)=>{
                        res.send({
                            info : billResult,
                            user : userResult,
                            admin_id : user_id
                        });
                    })
                })
            }else{
                res.render('adminLogin.html')
            }
        }else{
            res.render('adminLogin.html')
        }
    })
}

const logout = (req,res)=>{
    const session_id = req.body.session;
    const data= {
        user_select : 'user_id',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }
    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            const user_id = result[0].user_id;
            const delData = {
                table : 'session_info',
                condition : `user_id = ${user_id}` 
            }
            helper.deleteRowData(delData,(delResult)=>{
                if(delResult){
                    res.sendStatus(200);
                }else{
                    res.render('adminLogin.html')
                }
            })
        }else{
          res.render('adminLogin.html')
        }
    })
}

const disableEnable = (req,res) =>{
    const session_id = req.body.session;
    const user_id = req.body.user_id;
    const status = req.body.status;
    const data= {
        user_select : '*',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }
    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            if(result[0].user_type == 'admin'){
                const data = {
                    table : 'user_info',
                    columns : `block_status = ${status}`,
                    condition : `user_id = ${user_id}`
                }
                helper.updateData(data,(upResult)=>{
                    if(upResult){
                        res.sendStatus(200);
                    }else{
                        res.sendStatus(400);
                    }
                })
            }else{
                res.render('adminLogin.html')
            }
        }else{
            res.render('adminLogin.html')
        }
    })
}

const filterData = (req,res)=>{
    const session_id = req.body.session;
    const data= {
        user_select : '*',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }

    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            if(result[0].user_type == 'admin'){
                const paidData = {
                    select:'user_info.*,bill_data.*',
                    table:'user_info,bill_data',
                    condition : 'user_info.user_id = bill_data.user_id AND bill_data.paid_status=1'
                }

                helper.selectData(paidData,paidResult=>{
                    const pendingData = {
                        select:'user_info.*,bill_data.*',
                        table:'user_info,bill_data',
                        condition : 'user_info.user_id = bill_data.user_id AND bill_data.paid_status=0'
                    }

                    helper.selectData(pendingData, pendingResult=>{
                       const allData = {
                        select:'user_info.*,bill_data.*',
                        table:'user_info,bill_data',
                        condition : 'user_info.user_id = bill_data.user_id'
                       }

                       helper.selectData(allData, (allresult)=>{
                            res.send({
                                allBills : allresult,
                                paidBills : paidResult,
                                pendingBills : pendingResult
                            })
                       })
                    })
                })
            }
        }
    })
}

const paymentCount = (req,res)=>{
    const session_id = req.body.session;
    const data= {
        user_select : '*',
        user_table_name : 'user_info',
        condition_user : `user_id `,
        session_select : 'user_id',
        session_table_name : 'session_info',
        condition_session : `session_id = "${session_id}"` 
    }
    helper.sessionValidation(data, (result)=>{
        if(result.length == 1){
            if(result[0].user_type == 'admin'){
                const data = {
                    select : 'user_info.*,status.pending',
                    table : 'user_info, ( SELECT (count(paid_status)-sum(paid_status)) as pending, user_id from bill_data group by user_id) as status',
                    condition : 'user_info.user_id =status.user_id'
                }
                helper.selectData(data,userResult=>{
                    res.send({userResult : userResult,adminId : result[0].user_id});
                })
            }else{
                res.render('adminLogin.html')
            }
        }else{
            res.render('adminLogin.html')
        }
    })
}

const saveUsers = (req,res)=>{
    const user_name = req.body.user_name;
    const user_phone = req.body.user_phone;
    const user_address = req.body.user_address;
    const user_id = req.body.user_id;
    const saveData = {
        table : 'user_info',
        columns : `user_name="${user_name}",user_phone = ${user_phone},user_address="${user_address}"`,
        condition : `user_id = ${user_id}`
    }
    helper.updateData(saveData, (updateResult)=>{
        if(updateResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    })
}

const deleteUser =(req,res)=>{
    const user_id = req.body.user_id;
    const deleteUserData = {
        table : "user_info",
        condition : `user_id = ${user_id}`
    }
    helper.deleteRowData(deleteUserData,(delUserResult)=>{
        if(delUserResult){
            const deleteBillData = {
                table : "bill_data",
                condition : `user_id = ${user_id}`
            }
            helper.deleteRowData(deleteBillData,(delBillResult)=>{
                if(delBillResult){
                    res.sendStatus(200)
                }else{
                    res.sendStatus(500)
                }
            })
        }else{
            res.sendStatus(500)
        }
    })
}


const generateBill = (req,res)=>{
    const date = req.body.date;
    const billData = {
        select : 'user_id',
        table : 'user_info',
    }
    helper.fetchData(billData,(billResult)=>{
            let year = parseInt(date.slice(0,4));
            let day = parseInt(date.slice(8,10));
            let month = parseInt(date.slice(5,7));
            month = month == 12 ? 1 : month+1;
            year = month <= 12 ? year : year + 1;
            let out ;
            for(let i = 0 ; i < billResult.length ; i++){
                let billId = ('IN'+ Math.floor(Math.random()*100)+Math.random().toString(36).substr(2, 4)).toUpperCase();
                let meter = Math.floor(Math.random()*100000000);
                let consumption=Math.floor(Math.random()*1000);
                let status = i % 2==0 ? 1 : 0;
                const data={
                    bill_id:`${billId}`,
                    user_id:billResult[i].user_id,
                    meter_num:meter,
                    bill_generated_date:`${date}`,
                    bill_due_date:`${year}-${month}-${day}`,
                    consumption_units:consumption,
                    amount_due:calculateElectricityBill(consumption),
                    paid_status:status,
                    paid_date:'not paid'
                }
            const insertBill = {
                table : 'bill_data',
                columns : 'bill_id,user_id,meter_num,bill_generated_date,consumption_units,bill_due_date,amount_due,paid_status,paid_date',
                values : `'${data.bill_id}',${data.user_id},${data.meter_num},'${data.bill_generated_date}',${data.consumption_units},'${data.bill_due_date}',${data.amount_due},${data.paid_status},'${data.paid_date}'`
            }
            helper.insertData(insertBill,(insResult)=>{

            });
        } 
        res.sendStatus(200);
    })
}


const calculateElectricityBill = (unitsConsumed =>{
    if(unitsConsumed<=50){
         value =unitsConsumed*4.00
         return value.toFixed(2)
    }
    else if(unitsConsumed<=100){
        value=200+((unitsConsumed-50)*5.25)
        return value.toFixed(2)
    }
    else if ( unitsConsumed<=200){
        value= (462.5+((unitsConsumed-100)*6.80))
        return value.toFixed(2)
    }else {
         value = 1142.5+(unitsConsumed-200)*7.65
         return value.toFixed(2)
    }
})


module.exports = {admin,adminLogin,dashboard,billDetails,logout,disableEnable,filterData,paymentCount,saveUsers,deleteUser,generateBill}