import User from "../models/Users";
import Video from "../models/Video";
import bcrypt from "bcrypt";
// import fetch from "node-fetch";

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
        return res.render("login", {pageTitle: "Login"})
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
        const videos = await Video.find({});

        return res.redirect("/");
        // return res.render("home", {pageTitle:"Home", videos})

    } catch (e) {
        console.log("error : " + e)
        return res.end()
    }
}
export const startGitLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const gitFinish = async (req, res) => {
    const baseUrl = `https://github.com/login/oauth/access_token`;
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenReq = await(await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json();

    if ("access_token" in tokenReq) {
        const {access_token} = tokenReq;
        const apiUrl = "https://api.github.com";
        const userData = await(await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        console.log(userData);

        const emailData = await(await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        console.log(emailData);
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login")
        }
        let user = await User.findOne({email: emailObj.email});
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatarUrl,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/")

    } else {
        return res.redirect("/login")
    }
}
export const logout = (req, res) => {
    req
        .session
        .destroy();
    return res.redirect("/");
}

export const getUserEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"})
}

export const postUserEdit = async (req, res) => {
    const avatar = req.file;

    const {
        session: {
            user: {
                _id,
                username: sessionUsername,
                email: sessionEmail
            }
        },
        body: {
            name,
            email,
            username,
            location
        }
    } = req;

    console.log("req.file : " + req.file)
    console.log("req.body : " + req.body)

    let data = [];

    if (sessionUsername != username) {
        data.push({username})
    }

    if (sessionEmail != email) {
        data.push({email})
    }

    if (avatar != null){
        data.push({avatar})
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
        avatarUrl:avatar
    }, {new: true});
    req.session.user = updateUser;
    return res.redirect("/user/my-profile")
}

export const myProfile = async(req, res) =>{
    const { _id } = req.session.user
    await User.findById({_id})
    return res.render("myProfile", {pageTitle:"My Profile", avatar:""})
}
