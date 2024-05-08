const mongoose = require("mongoose")

const User = require("../models/user.model")
const { hasAccess } = require("../middlewares/auth.middleware")


exports.fetch = async (req,res) => {
    const { _id } = req.params

    const user = await User.findById(_id)

    res.json(user)
}


exports.currentUser = (req,res) => {
    res.json(req.user)
}


exports.fetchAllPending = async (req,res) => {
    const allPending = await User.find({'access.status' : "pending"})

    console.log("all pending", allPending)

    res.json(allPending)
}

// update
exports.update = async (req, res) => {
    const { _id } = req.params
    const user = await User.findById(_id)

    const update = {...user, ...req.body}

    update.save()
    req.status(200).json({ user: update})
    
}

// delete
exports.remove = async (req, res) => {
    const { _id } = req.params
    try{
        const resource = await User.findOne({_id})

        const hasAccess = hasAccess(req.user, resource)
 
        if(!hasAccess) {
            return res.status(403).json("You don't have access to perform this operation")
        }
        
        
        await User.deleteOne({_id})
        res.status(200)

    }catch(e){
        res.status(500).json("something went wrong")
    }
}