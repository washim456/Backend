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

    switch (role){
        case INTERN : {
            const exists = await Intern.findOne({email})
        
            if(exists) return res.status(409).json("Intern already exists")
            newCreated = new Intern({name, email, password})
            break;
        }

        case ADMIN: {
            const exists = await Admin.findOne({email})
        
            if(exists) return res.status(409).json("Intern already exists")
            newCreated = new Admin({name, email, password})
            break;
        }

        default: {
            return res.status(400).json("Something went wrong with the selected role")
        }
    }

    const organisation = await Org.findOne({name: "IMS"})
    organisation[`${role}s`].push(newCreated)

    
    await newCreated.save()
    await organisation.save()

    const token = generateToken(newCreated._id)
    res.json({user : newCreated, token})
}


exports.login = async (req,res) => {
    const { email, password, role } = req.body

    let account

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
            return res.status(400).json({ message : "Something went wrong with the selected role"})
        }
    }
    
    console.log("account", account)

    if(!account) return res.status(404).json({message : "Account not found"})

    const match = bcrypt.compare(password, account.password)

    if(!match) return res.status(401).json("Invalid username or password")

    const token = generateToken(account._id)
    console.log(token)
    res.json({user: account, token})
}


const generateToken = userId => jwt.sign({ _id: userId }, process.env.JWT_SECRET)
