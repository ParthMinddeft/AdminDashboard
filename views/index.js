const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/AdminDashboard');
const express = require('express');
const app = express();

const userRoute = require('../routes/userroute')
app.use('/',userRoute)

const adminRoute = require('../routes/adminroute')
app.use('/admin',adminRoute)

app.listen(5000,function(){
    console.log('Server Started')
});