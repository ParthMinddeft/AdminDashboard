const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const securePassword = async(password) => {
    try {
        const passwordhash = await bcrypt.hash(password,10);
        return passwordhash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadregister = async(req,res) => {
    try {
        res.render('register')
    } catch (error) {
        console.log(error.message)   
    }
}

const sendVerifyMail = async(name,email,user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            requireTLS:true,
            auth:{
                user:'parth.imscit18@gmail.com',
                pass:'ooycbwjqgcffrizz'
            }
        });
        const mailOptions = {
            from:'parth.imscit18@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hi' +name+',please click here to <a href = "http://localhost:5000/verify?id='+user_id+'"> Verify </a> your mail </p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if (error) {
                console.log(error);
            }
            else
            {
                console.log('Email Has Been Sent:-',info.response);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const insertuser = async(req,res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password:spassword,
            is_admin:0,
        });
        const userData = await user.save();

        if(userData)
        {
            sendVerifyMail(req.body.name,req.body.email,userData._id);
            res.render('register',{message:'your register has been successfully.Please Verify Your Email'})
        }
        else
        {
            res.render('register',{message:'your register has been failed'})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyMail = async(req,res) => {
    try {
        const updated = await User.updateOne({
            _id:req.query.id
        },{$set:{is_verified:1}})
        console.log(updated);
        res.render('email-verified');
    } catch (error) {
        console.log(error.message);
    }
}

const loginload = async(req,res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}

const verifylogin = async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if (userData) {
            const passwordmatch = await bcrypt.compare(password,userData.password);  
            if (passwordmatch) {
                if (userData.is_verified === 0) {
                    res.render('login',{message:'Please Verify Your Mail'})
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home')
                }
            }  
            else
            {
                res.render('login',{message:'Email And Password is incorrect'})
            }
        }
        else
        {
            res.render('login',{message:'Email And Password is incorrect'})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadhome = async(req,res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message)
    }
}

const userlogout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadregister,
    insertuser,
    verifyMail,
    loginload,
    verifylogin,
    loadhome,
    userlogout
}