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
                    console.log(session)
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
                    select : 'user_name,user_id,user_phone,user_address',
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


module.exports = {admin,adminLogin,dashboard,billDetails}