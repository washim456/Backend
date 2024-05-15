const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")

app.use(cors())
app.use("/uploads", express.static("uploads"))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const orgRoutes = require("./routes/org")
const internRoutes = require("./routes/interns")


app.use(authRoutes)
app.use(userRoutes)
app.use(orgRoutes)
app.use(internRoutes)



const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("server is online")
    require("./db")
})