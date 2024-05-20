const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const Admin = require("../models/admin.model")
const Intern = require("../models/intern.model")

exports.requireAuth = async (req,res,next) => {
    try{
        const token = req.headers.token
        const id = jwt.verify(token,process.env.JWT_SECRET)
    
        if(!id){
            return res.status(401).json({error: true, message: "You need to login"})
        }
    
        let user;
        
        // check if it's in admin collection
        user = await Admin.findById(id)
    
        if(!user){
            user = await Intern.findById(id)
        }

        req.user = user
        next()
    }catch(err){
        return res.status(400).json({error: true, message: "Try logging in again"})
    }
}

// checks whether a user has access to any resource
exports.hasAccess = (user, requestResource) => {
    
    // accessing own data
    if(user._id === requestResource._id)
        return true
    
    // role based access
    const accessRole = user.access.role
    const resourceRole = requestResource.access.role


    // owner has all access
    if(accessRole === "superadmin")
        return true

    // admins can access intern data    
    if(accessRole === "admin" && resourceRole === "intern")
        return true


    // no condition matched, deny access
    return false
}