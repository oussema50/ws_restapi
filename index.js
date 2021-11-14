const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User')
require('dotenv').config({path:'./config/.env'});
const port = process.env.PORT;

app.use(express.json());
//connect to database
mongoose.connect("mongodb://localhost:27017/ws_restapi")
.then(()=>console.log('database connect'))
.catch(err=>console.log('err',err));
//create a user
app.post('/createuser',async(req,res)=>{ 
    try
    {
        
        const {firstName,age,email,phone} = req.body
        const phoneExist = await User.findOne({phone});
        const emailExist = await User.findOne({email});
        console.log('phoneExist', phoneExist)
        console.log('emailExist', emailExist)
        if(!phoneExist){
            if(!emailExist){
                const user = await User.create({
                    firstName:firstName,
                    age:age,
                    email:email,
                    phone:phone
                });
                res.status(200).json({status:true,message:'user is created',data:user});
            }else{
                res.status(200).json({status:false,message:"the email already exists"})
            }
        }else{
            res.status(200).json({status:false,message:"the phone already exists"});
        }
        
        
    }catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err})
    }
});
//get all the users
app.get('/alluser',async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).json({status:true,message:'all user in the database',data:users});
    }catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err});
    }
});
//Update the user 
app.put('/updatuser/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {firstName,age,phone,email} = req.body;
        const user = await User.findById({_id:id});
        if(user)
        {
            const phoneExist = await User.findOne({phone});
            const emailExist = await User.findOne({email});
            if(!phoneExist){
                if(!emailExist){
                    const userUpdate = await User.findByIdAndUpdate({_id:id},{firstName,age,phone,email})
                    res.status(200).json({status:true,message:'the user is updated',data:userUpdate})
                }else{
                    res.status(200).json({status:false,message:'email already exists'})
                }
            }else{
                res.status(200).json({status:false,message:'phone already exists'})
            }
        }else{
            res.status(200).json({status:false,message:'the user does not exist'});
        }

    }catch(err)
    {
        console.log(err);
        res.status(500).json({status:false,message:err});
    }
});
//delete the user
app.delete('/removeuser/:id',async(req,res)=>{
    
    try{
        const {id} = req.params;
        const user = User.findById({_id:id})
        if(user){
            const removerUser = await User.findByIdAndDelete({_id:id})
            res.status(200).json({status:true,message:'user has been deleted',data:removerUser})
        }else
        {
            res.status(200).json({status:false,message:'user does not exist'});
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err})
    }
});
app.listen(port,()=>console.log('the server running on port ' + port));