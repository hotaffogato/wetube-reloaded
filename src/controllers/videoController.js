export const testUser = {
    username:"testUser",
    loggedIn: true,
}

let videos = [
    {
        title:"First Video", 
        rating:5,
        comments:2,
        creadeAt:"2 minutes ago",
        views:59,
        id:1,
    },
    {
        title:"Second Video", 
        rating:5,
        comments:2,
        creadeAt:"2 minutes ago",
        views:59,
        id:2,
    },
    {
        title:"Third Video", 
        rating:5,
        comments:2,
        creadeAt:"2 minutes ago",
        views:59,
        id:3,
    }
];

export const trending = (req, res) => {
    return res.render("home", {pageTitle:"Home", testUser : testUser , videos})
}

export const see = (req, res) => {
    return res.render("watch")
}

export const edit = (req, res) => {
    res.render("edit")
}

export const search = (req, res) => {
    res.send("Search");
}

export const upload = (req, res) => {
    res.send("Search");
}

export const deleteVideo = (req, res) => {
    res.send("Delete Video")
}

