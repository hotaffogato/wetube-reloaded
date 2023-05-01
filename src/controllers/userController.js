import User from "../models/Users";
import bcrypt from "bcrypt";

export const see = (req, res) => res.send("User see");

export const getJoin = (req, res) => {
    return res.render("join",{pageTitle:"Join"})
}
export const postJoin = async(req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    if (password !== password2){
        console.log("Password confirmation does not match")
        return res.status(400).render("join",{pagetitle:"Join", errorMessage:"Password confirmation does not match"})
    }
    const exists = await User.exists({ $or: [{username},{email}] })
    if (exists){
        console.log("This username/email is already taken")
        return res.status(400).render("join",{pagetitle:"Join", errorMessage:"This username/email is already taken"})
    }
    try{
    await User.create({ 
        name,
        username,
        email,
        password,
        location
    })
        return res.render("login",{pageTitle:"Login"})
    } catch(e){
        console.log("error : " + e)
        return res.status(400).render("join", { pagetitle:"Join", errorMessage:e })
    }
}

export const getLogin = (req, res) => {
    return res.render( "login",{pageTitle:"Login"} )
}

export const postLogin = async(req, res) => {
    try {
    const {username, password} = req.body;

    const user = await User.findOne({username})
    if(!user){
        console.log("User not exist")
        return res.status(400).render("login",{pagetitle:"Login", errorMessage:"User not exist"})
    }

    const check = await bcrypt.compare(password, user.password)
    if(!check){
        console.log("wrong password")
        return res.status(400).render("login", {pagetitle:"Login", errorMessage:"wrong password"})
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/")

    }catch(e){
        console.log("error : "+ e)
        return res.end()
    }
}

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User")
export const logout = (req, res) => res.send("User Logout");
