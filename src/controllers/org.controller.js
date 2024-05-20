// not in use

const Org = require("../models/org.model")

exports.fetchAll = async (req,res) => {
    try{
        const orgData = await Org.findOne({name : "IMS"}).populate(["superadmins", "admins", "interns"])
        res.json(orgData)
    }catch(err){
        console.log(err)
        res.status(500).json("something went wrong")
    }
}