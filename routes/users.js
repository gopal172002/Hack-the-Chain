const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");


mongoose.connect("mongodb+srv://hskhanduja03:hsk123@cluster0.4mnladl.mongodb.net");
// Define User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type:String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type:String,
    required:true,
  },
  complaints: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Complaint"
  }],
});

UserSchema.plugin(plm);

// Create models based on schemas
module.exports = mongoose.model('User', UserSchema);

