import Video from "../models/Video"


export const home = async(req, res) => {
    const videos = await Video.find({})
    return res.render("home", {pageTitle:"Home", videos})
}

export const watch = (req, res) => {
    const { id } = req.params;
    return res.render("watch", { pageTitle: video.title });
}

export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", { pageTitle : "Edit"});
}

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle :"Upload Page" })
}

export const postUpload = (req, res) => {
    return res.redirect("/")
}