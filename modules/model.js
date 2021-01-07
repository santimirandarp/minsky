// build the model
const mongoose  = require("mongoose")
const { Schema } = mongoose
const msgSchema = new Schema({
  msg:{
    type:String, required:true
  },
  createdAt:{
    type:Date, required:true, index:true, default:Date()
  }
})

exports.msgModel = mongoose.model("message", msgSchema)
