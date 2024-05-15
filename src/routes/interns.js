const express = require("express")

const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads") 
    },
    filename: function (req, file, cb) {
      const resource = req.url.split("/")[2]
      const { _id } = req.params
      const uniqueSuffix = Date.now()
      cb(null, resource + "." + _id + "." + uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


const { uploadSummaryReport, uploadResume, updateIntern, removeSummaryReport } = require("../controllers/intern.controller")


router.patch("/interns/:_id", updateIntern)
router.patch("/interns/summary-report/:_id", upload.single('file'), uploadSummaryReport)
router.delete("/interns/summary-report/:userId/:summaryId", removeSummaryReport)

router.patch("/interns/resume/:_id", upload.single('file'), uploadResume)

module.exports = router