const helper = require('../helper/helper.js');
const {uuid} = require('uuidv4');

const admin = (req,res)=>{
    res.render('login.html')
}




module.exports = {admin}