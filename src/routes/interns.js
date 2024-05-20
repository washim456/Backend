const express = require("express")

const multer = require('multer')

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


const { uploadSummaryReport, uploadResume, updateIntern, removeSummaryReport, fetchAll } = require("../controllers/intern.controller")
const { requireAuth } = require("../middlewares/auth.middleware")

// fetch all interns
router.get("/interns", requireAuth, fetchAll)

// update intern data
router.patch("/interns/:_id", requireAuth, updateIntern)

// update intern summary report
router.patch("/interns/summary-report/:_id", upload.single('file'), requireAuth, uploadSummaryReport)

// delete intern summary report
router.delete("/interns/summary-report/:userId/:summaryId", requireAuth, removeSummaryReport)

// update intern resume
router.patch("/interns/resume/:_id", upload.single('file'), requireAuth, uploadResume)

module.exports = router