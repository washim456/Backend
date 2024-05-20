const User = require("../models/user.model")
const Intern = require("../models/intern.model")
const Admin = require("../models/admin.model")

const Org = require("../models/org.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { INTERN, ADMIN } = require("../constants")

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body

    let newCreated

    try{
        switch (role){
            case INTERN : {
                const exists = await Intern.findOne({email})
            
                if(exists) return res.status(409).json({error: true, message: "Intern already exists"})
                newCreated = new Intern({name, email, password})
                break;
            }
    
            case ADMIN: {
                const exists = await Admin.findOne({email})
            
                if(exists) return res.status(409).json({error: true, message: "Admin already exists"})
                newCreated = new Admin({name, email, password})
                break;
            }
    
            default: {
                return res.status(400).json({error: true, message: "Something went wrong with the selected role"})
            }
        }
    
        const organisation = await Org.findOne({name: "IMS"})
        organisation[`${role}s`].push(newCreated)
    
        
        await newCreated.save()
        await organisation.save()
    
        const token = generateToken(newCreated._id)
        res.json({user : newCreated, token})

    }catch(err){
        res.status(500).json({error: true, message: "Something went wrong"})
    }
}


exports.login = async (req,res) => {
    const { email, password, role } = req.body

    let account
    try{
        switch(role){
            case INTERN : {
                account = await Intern.findOne({email})
                break;
            }
            case ADMIN : {
                account = await Admin.findOne({email})
                break;
            }
    
            default: {
                return res.status(400).json({error:true, message : "Something went wrong with the selected role"})
            }
        }
        
        if(!account) return res.status(404).json({error: true, message : "Account not found"})
    
        const match = await bcrypt.compare(password, account.password)

        console.log("match", match)
    
        if(!match) return res.status(401).json({error: true, message: "Invalid username or password"})
    
        const token = generateToken(account._id)
        res.json({user: account, token})

    }catch(err){
        res.status(500).json({error: true, message: "Something went wrong"})
    }
}

exports.uploadProfilePic = async (req, res) => {
    const { _id, role } = req.params
    try{

        if(role === "admin"){
            const admin = await Admin.findByIdAndUpdate(_id, {
                profilePic : {
                    fileName : req.file.originalname,
                    url : req.file.filename
                }
            }, {new: true})
            return res.json(admin)
        }

        if(role === "intern"){
            const intern = await Intern.findByIdAndUpdate(_id, {
                profilePic : {
                    fileName : req.file.originalname,
                    url : req.file.filename
                }
            }, {new: true})
            return res.json(intern)
        }
    }catch(err){
        res.status(500).json({error : true, message : "Couldn't upload"})
    }
}

exports.updateUser = async (req,res) => {
    const { _id } = req.params
    const { name, email, role } = req.body

    try{
        if(role === "admin"){
            const admin = await Admin.findByIdAndUpdate(_id, {
                name, email
            }, {new: true})
    
            return res.status(201).json(admin)
        }
    
        if(role === "intern"){
            const intern = await Intern.findByIdAndUpdate(_id, {
                name, email
            }, {new: true})
    
            return res.status(201).json(intern)
        }
    }catch(err){
        res.status(500).json({error : true, message : "Couldn't update"})
    }
}

exports.deleteUser = async (req, res) => {
    const { _id, role } = req.params

    try{
        if(role === "admin"){
            const admin = await Admin.findByIdAndDelete(_id)
    
            return res.status(200).json(admin)
        }
    
        if(role === "intern"){
            const intern = await Intern.findByIdAndDelete(_id)
    
            return res.status(200).json(intern)
        }
    }catch(err){
        res.status(500).json({error : true, message : "Couldn't delete"})
    }
}

// caution : This controller should always be called with requireAuth middleware,
// since we are just returning the current user
exports.fetchSelf = async (req, res) => {
    res.status(200).json({user: req.user})
}

const generateToken = userId => jwt.sign({ _id: userId }, process.env.JWT_SECRET)
