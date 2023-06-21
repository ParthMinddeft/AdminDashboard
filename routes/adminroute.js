const express = require('express')

const admin_route = express()

const session = require('express-session')

const config = require('../config/config')

admin_route.use(session({secret:config.sessionSecret}))

const bodyParser = require('body-parser')

admin_route.use(bodyParser.json());

admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');

admin_route.set('views','../views/admin')

const auth = require('../middleware/adminauth')

const admincontroller = require('../controllers/admincontroller')

admin_route.get('/',auth.islogout,admincontroller.loadlogin)

admin_route.post('/',admincontroller.verifylogin);

admin_route.get('/home',auth.islogin,admincontroller.loaddashboard);

admin_route.get('/logout',auth.islogin,admincontroller.adminlogout);

admin_route.get('/dashboard',auth.islogin,admincontroller.admindashboard);

admin_route.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports = admin_route

