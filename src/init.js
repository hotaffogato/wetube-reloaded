import "dotenv/config"
import "./db.js" 
import "./models/Video"
import "./models/Users"
import "./models/Comment"
import app from "./server.js"

const PORT = 4000;

const handelListening = () => 
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
 
app.listen(PORT, handelListening)