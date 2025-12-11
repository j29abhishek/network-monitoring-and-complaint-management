const mongoose =require('mongoose');
const ipStatusSchema=new mongoose.Schema({
  ipAddress: { type: String, required: true },
  status: { type: String, required: true },
  packetDrops: { type: String },
  timestamp: { type: Date, default: Date.now },
})

module.exports=mongoose.model('ipstatuscollections',ipStatusSchema)