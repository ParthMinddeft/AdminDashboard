const User = require('../models/usermodel');

const bcrypt = require('bcrypt');

const loadlogin = async(req,res) => {
    try {
        res.render('login')
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
            const passwordmatch = await bcrypt.compare(password,userData.password)
            if (passwordmatch) {
                if (userData.is_admin === 0) {
                    res.render('login',{message:'Email And Password is incorrect'});
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home');
                }
            } else {
                res.render('login',{message:'Email And Password is incorrect'});
            }
        } else {
            res.render('login',{message:'Email And Password is incorrect'});
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loaddashboard = async(req,res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message)
    }
}

const adminlogout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message)
    }
}

const admindashboard = async(req,res) => {
    try {
        await User.find({
            is_admin:0
        })
        res.render('dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadlogin,
    verifylogin,
    loaddashboard,
    adminlogout,
    admindashboard
}