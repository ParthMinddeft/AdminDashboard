const express = require('express')

const userroute = express()

const session = require('express-session')

const config = require('../config/config')

userroute.use(session({secret:config.sessionSecret}))

const auth = require('../middleware/auth')

userroute.set('view engine','ejs');
userroute.set('views','../views/users')

const bodyparser = require('body-parser');
userroute.use(bodyparser.json());
userroute.use(bodyparser.urlencoded({extended:true}))

const usercontroller = require('../controllers/usercontroller')

userroute.get('/registration',auth.islogout,usercontroller.loadregister);

userroute.post('/registration',usercontroller.insertuser);

userroute.get('/verify',usercontroller.verifyMail)

userroute.get('/',auth.islogout,usercontroller.loginload)

userroute.get('/login',auth.islogout,usercontroller.loginload)

userroute.post('/login',usercontroller.verifylogin)

userroute.get('/home',auth.islogin,usercontroller.loadhome)

userroute.get('/logout',auth.islogin,usercontroller.userlogout)

module.exports = userroute; 