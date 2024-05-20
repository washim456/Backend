// not in used

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const orgSchema = new mongoose.Schema({
    name : {
        type: "String",
        default: "IMS"
    },
    admins : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    interns : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    superadmins : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ]
})


module.exports = mongoose.model("Org", orgSchema)