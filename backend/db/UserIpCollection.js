const mongoose=require('mongoose');
const ipSchema=new mongoose.Schema({
    department:String,
    room:String,
    contact:Number,
    email:String,
    username:String,
    ip:String,
    mac:String,
    engineer:String,
    vlan:String,
    switchIp:String,
    port:Number
});

module.exports=mongoose.model("useripcollections",ipSchema)