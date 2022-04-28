const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const User = require("../models/userSchema")

router.get('/',(req,res)=>{
    res.send(`hello world from server router`)
})

// router.post('/register',async (req,res)=>{

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword ){
//         return res.status(422).json({error:"not filled form error"})
//     }

//     User.findOne({email:email})
//         .then((userExist) =>{
//             if(userExist){
//                 return res.status(422).json({error:"email alreadyavailable"});
//             }
        

//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(()=>{
//             res.status(201).json({message:"user registered successfully"});
//         }).catch((err)=>res.status(500).json({error:"failed to register"}));
//     }).catch(err =>{ console.log(err); });
// })

router.post('/register', async (req,res)=>{

    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword ){
        return res.status(422).json({error:"not filled form error"})
    }
    try{
        const userExist= await User.findOne({email:email})

        if(userExist){
            return res.status(422).json({error:"email alreadyavailable"});
        }else if(password!=cpassword){
            return res.status(422).json({error:"password are not matching"});
        }else{
            const user = new User({name, email, phone, work, password, cpassword});
        
        await user.save();

        
        res.status(201).json({message:"user registered successfully"});

        }

        

        

        

    }catch(err){
        console.log(err);
    }

    
});
// login route

router.post('/signin', async (req,res) => {
    
    try{
        let token;
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Invalid"})
        }

        const userLogin = await User.findOne({email:email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);        
            const token = await userLogin.generateAuthToken(); 
            console.log(token);
            res.cookie("jetoken", token,{
                expires:new Date(Date.now() + 2589200000),
                httpOnly:true
            });


            if(!isMatch){
                res.status(400).json({ error:"error"});
            }else{
                res.json({ message:"logged in"});
            }
        }else{
            res.status(400).json({ error:"error"});
        }

       
        
    }catch(err){
        console.log(err);
    }
})

module.exports = router;