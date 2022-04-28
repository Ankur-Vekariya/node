const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
dotenv.config({path: './config.env'});
require('./db/conn');
app.use(express.json());

const User = require('./models/userSchema');

app.use(require('./router/auth'));

const PORT = process.env.PORT;



const middleware = (req,res, next)=>{
    console.log(`hello my middleware`);
    next();    
}



app.get('/',(req,res)=>{
    res.send(`hello world from server`)
})

app.get('/about',middleware, (req,res)=>{
    res.send(`hello about `)
})

app.get('/contact',(req,res)=>{
    // res.cookie("test",'ankur');
    res.send(`hello contact world from server`)
})

app.listen(PORT,()=>{
    console.log(`server is running on prot ${PORT}`)
})