const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const internSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    dept: {
        type: String
    },
    internshipType: {
        type: String,
        enum: ["residential", "non-residential", "onedayvisit"]
    },
    contactNo: {
        type: Number,
        maxLength: 10,
        minLength: 10
    },
    referredBy: {
        type: String
    },
    paid: {
        type: Boolean
    },
    feedBack: {
        type: String,
        maxLength: 50
    },
    startDate : {
        type: String
    },
    endDate : {
        type: String
    },
    resume : {
       fileName: {
            type: String
        },
       url : {
           type: String
       }
    },
    summaryReport : [ {
        fileName : String,
        url : String
    } ],
    role : {
        type: String,
        default: "intern"
    }
})

internSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const internModel = mongoose.model("Intern", internSchema)


module.exports = internModel