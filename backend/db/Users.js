const mongoose =require('mongoose');
const userSchema= new mongoose.Schema({
    name:String,
    number:Number,
    password:String,
    email:String,
    status:{type:String,default:"pending"},
    role:{type:String,default:"user"},
});

module.exports=mongoose.model("users",userSchema)