const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default : "admin"
    },
    profilePic : {
        fileName: {
             type: String
         },
        url : {
            type: String
        }
     },
})

adminSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const adminModel = mongoose.model("Admin", adminSchema)


module.exports = adminModel