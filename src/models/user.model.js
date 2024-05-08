const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: "String"
    },
    email: {
        type: "String"
    },
    password: {
        type: "String"
    },
    dept: {
        type: "String"
    },
    access: {
        role: {
            type: "String",
            enum: ["superadmin", "admin", "intern"],
            default: "intern"
        },
        status: {
            type: "String",
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    startDate : {
        type: "Date"
    },
    endDate : {
        type: "Date"
    }
})

/**
 * accessRole : {
        type: "String",
        enum: [""]
    },

     isSuperAdmin: {
        type: "Boolean",
        default: false
    },
    isAdmin: {
        type: "Boolean",
        default: false
    },
 */

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const userModel = mongoose.model("User", userSchema)


module.exports = userModel