import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content:{ type:String, required:true },
  createdAt: { type : Date, required : true, default : Date.now },
  owner:{type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video:{type: mongoose.Schema.Types.ObjectId, ref: "Video" },
});

const commentModel = mongoose.model("Comment", commentSchema)

export default commentModel;