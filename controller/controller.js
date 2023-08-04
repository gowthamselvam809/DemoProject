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
        table : 'user_infos',
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
                                    res.json({session :sessionId,isAdmin:true,isValid:true})
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
    res.render('dashboard.html')
}



module.exports = {admin,adminLogin,dashboard}