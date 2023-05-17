import "dotenv/config"
import "./db.js" 
import "./models/Video.js"
import "./models/Users.js"
import app from "./server.js"

const PORT = 4000;

const handelListening = () => 
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
 
app.listen(PORT, handelListening)