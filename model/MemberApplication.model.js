const mongoose = require('mongoose');

const MemberApplicationSchema = new mongoose.Schema(
{
  fullName: {
    type :String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
},  {
      timestamps:true
    });

const MemberApplication = mongoose.model(
  "MemberApplication",
  MemberApplicationSchema
);
module.exports = MemberApplication;
