import bcrypt from "bcrypt";
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    avatarUrl: String,
    name:{type:String, required:true},
    socialOnly:{type:Boolean, default:false},
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    location:String,
});

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5)
})

const userModel = mongoose.model("User", userSchema)

export default userModel;