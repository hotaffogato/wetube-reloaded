import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    fileUrl:{ type : String, required:true },
    thumbUrl : {type : String, required : true },
    title: { type : String, required : true, trim: true, maxLength:60 },
    description: { type : String, required : true, trim: true, minLength:2 },
    createdAt: { type : Date, required : true, default : Date.now },
    // hashtags: [{type: String, trim: true}],
    meta: {
        views: { type : Number, default : 0, required : true },
        likes: { type : Number, default : 0, required : true },
    },
    owner:{type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    comments:[{type:mongoose.Schema.Types.ObjectId, ref: "Comment"}],
});

// videoSchema.static("formatHashtags", function(hashtags){
//     return hashtags.split(",").map(w => w.startsWith("#") ? w : `#${w}`)
// })
// 해쉬태그는 탭 또는 스페이스바를 누를 시 한 블럭으로 정리

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;