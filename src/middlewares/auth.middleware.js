const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

exports.requireAuth = async (req,res,next) => {
    const token = req.headers.token

    const id = jwt.verify(token,process.env.JWT_SECRET)

    if(!id){
        return res.status(401).json("You need to login")
    }

    const user = await User.findById(id)

    req.user = user
    next()
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