import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content:{ type:String, required:true },
  createdAt: { type : Date, required : true, default : Date.now },
  user:[{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const commentModel = mongoose.model("Comment", commentSchema)

export default commentModel;