import User from "../models/Users";
import bcrypt from "bcrypt";
// import fetch from "node-fetch";

export const see = (req, res) => res.send("User see");

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

        return res.redirect("/")

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
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenReq = await(await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();

    if ("access_token" in tokenReq) {
        const {access_token} = tokenReq;
        const apiUrl = "https://api.github.com";
        const userData = await(await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            },
        })).json();
        console.log(userData);

        const emailData = await(await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
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
                location: userData.location,
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

export const edit = (req, res) => res.send("Edit User");
