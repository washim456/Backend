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
exports.updateUser = async (req, res) => {
   try{
       const { _id } = req.params

       console.log(_id)
       
       const user = await User.findByIdAndUpdate(_id, {
           ...req.body
       })
   
       // const update = {...user, ...req.body}
   
       // update.save()
       res.status(200).json({ user })

   }catch(err) {
    res.status(500).json(err.message)
   }
    
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