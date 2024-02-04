const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testendgame2");

const userSchema = mongoose.Schema({
  username : {
    type:String,
    reqiure:true,
    unique:true,
  },

  password : {
    type:String,
  
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  profileImage:String,

  email: {
    type:String,
    require:true,
    unique:true,
  },
  fullName:{
    type:String,
  }

});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);