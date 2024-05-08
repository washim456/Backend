const mongoose = require("mongoose")

const Org = require("./models/org.model")
const User = require("./models/user.model")

const { MONGODB_URI } = process.env

const superAdmin = {
    name : "admin",
    email : "admin@admin.com",
    password : "admin@123",
    access : {
        role : "superadmin",
        status : "approved"
    }
}


// initialise database connection  
const init = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        const organisation = await Org.findOne({ name: "IMS" })


        // create the org and super admin when starting for first time
        if (!organisation) {
            const newOrg = new Org()
            
            console.log("Organisation created successfully")
            
            const { name, email, password, access } = superAdmin

            const adminUser = new User({ name ,email , password, access })
            
            newOrg.superadmins.push(adminUser)
            
            await adminUser.save()
            await newOrg.save()
        }

        console.log("database connected")

    } catch (err) {
        console.warn("Error connecting db", err.message)
    }
}

init()