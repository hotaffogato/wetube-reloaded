import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    //로그인이 되어있는지 확인하고 res.locals에 값을 전한다
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next()
}

export const protectMiddleware = (req, res, next) => {
    //로그인이 되어있으면 next
    if(req.session.loggedIn){
        next()
    } else {
        req.flash("error", "Not authorized")
        console.log("Middelware Massage : You are not logged in, move to Login")
        return res.redirect("/login");
    }
}

export const publicMiddleware = (req, res, next) => {
    //로그인이 안되어있으면 next
    if(!req.session.loggedIn){
        return next()
    } else {
        req.flash("error", "Not authorized")
        console.log("Middelware Massage : You already logged in, move to home")
        return res.redirect("/")
    }
}
export const uploadImg = multer({dest:"uploads/avatars"})

export const uploadVideo = multer({dest:"uploads/videos"})