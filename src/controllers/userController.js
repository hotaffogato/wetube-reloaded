import User from "../models/Users";
import Comment from "../models/Comment";
import bcrypt from "bcrypt";

//내가 쓴 댓글만 모아보기를 추가할 수 있다

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"})
}
export const postJoin = async (req, res) => {
    const {
        name,
        username,
        email,
        password,
        password2,
        location
    } = req.body;
    if (password !== password2) {
        console.log("Password confirmation does not match")
        return res
            .status(400)
            .render("join", {
                pagetitle: "Join",
                errorMessage: "Password confirmation does not match"
            })
    }
    const exists = await User.exists({
        $or: [{
                username
            }, {
                email
            }]
    })
    if (exists) {
        console.log("This username/email is already taken")
        return res
            .status(400)
            .render("join", {
                pagetitle: "Join",
                errorMessage: "This username/email is already taken"
            })
    }
    try {
        await User.create({name, username, email, password, location})
        console.log("user create done")
        return res.redirect("/login")
    } catch (e) {
        console.log("error : " + e)
        return res
            .status(400)
            .render("join", {
                pagetitle: "Join",
                errorMessage: e
            })
    }
}
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"})
}

export const postLogin = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username, socialOnly: false})
        if (!user) {
            console.log("User not exist")
            return res
                .status(400)
                .render("login", {
                    pagetitle: "Login",
                    errorMessage: "User not exist"
                })
        }

        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            console.log("wrong password")
            return res
                .status(400)
                .render("login", {
                    pagetitle: "Login",
                    errorMessage: "wrong password"
                })
        }

        req.session.loggedIn = true;
        req.session.user = user;

        return res.redirect("/");

    } catch (e) {
        console.log("error : " + e)
        return res.end()
    }
}

export const logout = (req, res) => {
    req
        .session
        .destroy();
    return res.redirect("/");
}

export const profile = async(req, res) =>{
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path:"videos",
        populate:{
            path:"owner",
            model:"User"
        }
    });

    if(!user){
        return res.status(404).render("404", {pageTitle:"User not found."})
    }

    return res.render("profile", {
        pageTitle:user.name, user
    });
}
export const getEdit = (req, res) => {
    const {user:{avatarUrl : avatar}} = req.session
    return res.render("edit-profile", {pageTitle: "Edit Profile", avatar})

}

export const postEdit = async (req, res) => {

    const {id} = req.params;
    const {
        session: {
            user: { _id, avatarUrl, email:sessionEmail, username:sessionUsername }
        },
        body: {
            name,
            email,
            username,
            location
        },
        file,
    } = req;

    let data = [];

    if (sessionUsername != username) {
        data.push({username})
    }

    if (sessionEmail != email) {
        data.push({email})
    }

    if (data.length > 0) {
        const exist = await User.findOne({$or: data});
        if (exist) {
            return res
                .status(400)
                .render("edit-profile", {
                    pageTitle: "Edit Profile",
                    errorMessage: "This username/email is alread taken."
                })
        }
    }

    const updateUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location,
        avatarUrl: file ? file.path : avatarUrl,
    }, {new: true});
    req.session.user = updateUser;
    req.flash("info","Your profile has been updated.")
    return res.redirect("/user/" + id)
}