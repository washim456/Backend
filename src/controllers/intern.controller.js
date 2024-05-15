
const Intern = require("../models/intern.model")

exports.uploadSummaryReport = async(req,res) => {
    const { _id } = req.params
    try{
        const intern = await Intern.findById(_id)
        intern.summaryReport.push({ fileName : req.file.originalname, url : req.file.filename})
        const result = await intern.save()
        res.json(result)
    }catch(err){
        res.status(500).json("Couldn't upload")
    }
}

exports.uploadResume = async(req,res) => {
    const { _id } = req.params
    try{
        const intern = await Intern.findByIdAndUpdate(_id, {
            resume : {
                fileName : req.file.originalname,
                url : req.file.filename
            }
        }, {new: true})
        res.json(intern)
    }catch(err){
        res.status(500).json("Couldn't upload")
    }
}

exports.updateIntern = async(req,res) => {
    const { _id } = req.params
    try{
        const intern = await Intern.findByIdAndUpdate(_id, {
            ...req.body
        }, {new: true} )

        console.log("intern", intern)
        res.status(200).json(intern)
    }catch(err){
        res.status(500).json(err.message)
    }
}

exports.removeSummaryReport = async (req,res) => {
    const {userId, summaryId} = req.params

    //  const event = await Event.findOneAndUpdate({ participants: participant._id }, { $pull: { participants: participant._id } }, { new: true });
    const intern = await Intern.findOneAndUpdate({ _id: userId}, { "$pull" : { summaryReport : {_id : summaryId} } }, {new: true})

    res.status(200).json(intern)

}