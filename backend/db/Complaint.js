const mongoose=require('mongoose')
const complaintSchema=new mongoose.Schema({
    userName:String,
    gmail:String,
    phoneNumber:Number,
    roomNumber:String,
    selectedIssue:String,
    description:String,
    status:{type:String,default:"Pending"},
    createdAt:{type:Date, default:Date.now}
});

module.exports=mongoose.model("complaints",complaintSchema);