const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")

app.use(cors())

app.use(express.json())
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const orgRoutes = require("./routes/org")


app.use(authRoutes)
app.use(userRoutes)
app.use(orgRoutes)



const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("server is online")
    require("./db")
})