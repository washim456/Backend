const User = require("../models/user.model")
const Org = require("../models/org.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body

    const access = {
        role
    }

    const userExists = await User.findOne({email})

    if(userExists) return res.status(409).json("User already exists")

    const newUser = new User({name, email, password, access})

    console.log(newUser)

    const organisation = await Org.findOne({name: "IMS"})


    organisation[`${role}s`].push(newUser)

    
    await newUser.save()
    await organisation.save()
    const token = generateToken(newUser._id)
    res.json({user : newUser, token})
}


exports.login = async (req,res) => {
    const { email, password } = req.body
    console.log(req.body)
    console.log(email, password)

    const user = await User.findOne({email})
    
    if(!user) return res.status(404).send("Not found")

    const match = bcrypt.compare(password, user.password)

    if(!match) return res.status(401).json("not matched")

    const token = generateToken(user._id)
    console.log(token)
    res.json({user, token})
}


const generateToken = userId => jwt.sign({ _id: userId }, process.env.JWT_SECRET)
