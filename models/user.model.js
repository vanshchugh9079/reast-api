import mongoose,{ Schema } from "mongoose";

let userSchema=new Schema({
  first_name:{
    type:String,
    required:true
  },
  last_name:{
    type:String,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  gender:{
    type:String,
    required:true
  }
},{
    timestamps:true
})
export const User=mongoose.model("User",userSchema)