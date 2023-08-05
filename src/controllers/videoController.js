import Video from "../models/Video"
import User from "../models/Users"
import Comment from "../models/Comment"
import { async } from "regenerator-runtime"

export const home = async(req, res) => {
    const videos = await Video.find({})
        .sort({created:"desc"})
        .populate("owner")
    return res.render("home", {pageTitle:"Home", videos})
}

export const watch = async(req, res) => {
    const { id } = req.params
    const video = await Video.findById(id).populate("owner").populate({
        path:"comments",
        populate:{
            path:"owner",
            model:"User"
        }
    })
    if(!video){
        return res.status(404).render("404", {errorMessage:"Video not found"})
    }
    let loggedInUser
    if(req.session.loggedIn){
        loggedInUser = req.session.user
    }
    return res.render(
        "watch", { 
            pageTitle: video.title, 
            video,
            comments:video.comments,
            loggedInUser : loggedInUser ? loggedInUser : ""
        }
    );
}
    
export const getEdit = async(req, res) => {
    const { id } = req.params;
    const {user:{_id}} = req.session
    const video = await Video.findById(id)
    if(!video){
        return res.status(400).render("404",{pageTItle:"Video not found."})
    }
    if(String(video.owner) !== String(_id)){
        console.log("not match")
        return res.status(403).redirect("/")
    }
    return res.render("edit", { pageTitle : "Edit", video });
}

export const postEdit = async(req, res) => {
    
    const { id } = req.params;
    const {user:{_id}} = req.session
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);

    if (!video) {
        return res.status(404).render("404", {pageTItle:"Video not found."})
    }

    if(String(video.owner) !== String(_id)){
        console.log("not match")
        return res.status(403).redirect("/")
    }
    // const hashtags = Video.formatHashtags(hashtags)
    await Video.findByIdAndUpdate( id , {title, description, })
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle :"Upload Page" })
}

export const postUpload = async(req, res) => {
    const {
        body:{ title, description,},
        session:{user:{_id}},
        } = req;
    const { video, thumb } = req.files

    try{
        const newVideo = await Video.create({
            fileUrl:video[0].path,
            thumbUrl:thumb[0].path,
            title,
            description,
            owner:_id,
            // hashtags : Video.formatHashtags(hashtags)
        });
        const user = await User.findById(_id)
        user.videos.push(newVideo._id)
        user.save()
        return res.redirect("/")

    } catch(error){
            return res.status(400).render("upload", { 
            pageTitle:error,
            errorMessage:error,
            })
    }
}

export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    const {user:{_id}} = req.session;
    const video = await Video.findById(id)
    if(!video){
        return res.status(400).render("404",{pageTitle:"Video not found"})
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/",{errorMessage:"Owner is not match"})
    }
    await Video.findByIdAndDelete(id)
    return res.redirect("/")
}

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex : new RegExp(`${keyword}$`, "i"),
            }
        }).populate("owner")
    }
    return res.render("search", {pageTitle:"Search",  videos})
}

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id)
    if(!video){
        return res.sendStatus(404)
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200)
}

export const createComment = async (req, res) => {
    const {
        session:{user},
        body:{content},
        params:{id},
    } = req;

    const videoModel = await Video.findById(id);
    const userModel = await User.findById(user._id);
    
    if(!videoModel || !userModel){
        return res.sendStatus(404)
    }
    
    const newComment = await Comment.create({
        content,
        owner : user._id,
        video : id
    })

    videoModel.comments.push(newComment._id)
    userModel.comments.push(newComment._id)
    videoModel.save();
    userModel.save();
    return res.sendStatus(201);
}

export const deleteComment = async (req, res) => {
    const {
        session:{user:{_id:id}}, 
        params:{commentId, videoId}
    } = req
    const comment = await Comment.findById(commentId)
    if(!comment || comment.owner.toString() !== id){
        return res.sendStatus(400)
    }
    // await Comment.findByIdAndDelete(commentId)
    console.log("delete comment from video model find to use commentId")
    console.log("delete comment from user model find to use commentId")

    return res.status(200).redirect(`/videos/${videoId}`)
}