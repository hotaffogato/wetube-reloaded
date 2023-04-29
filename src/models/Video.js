import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type : String, required : true, trim: true, maxLength:60 },
    description: { type : String, required : true, trim: true, minLength:1 },
    createdAt: { type : Date, required : true, default : Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        views: { type : Number, default : 0, required : true },
        rating: { type : Number, default : 0, required : true },
    }
});

videoSchema.static("formatHashtags", function(hashtags){
    return hashtags.split(",").map(w => w.startsWith("#") ? w : `#${w}`)
})

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;