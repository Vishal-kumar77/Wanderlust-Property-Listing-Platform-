// For authentication purpose

const mongoose=require("mongoose");

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);// using passportLocalMongoose as a plugin 

const User=mongoose.model("User",userSchema);

module.exports=User;