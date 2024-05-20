
// common routes between admin and intern

const express = require("express")

const router = express.Router()

const multer  = require('multer')


const { signup, login, uploadProfilePic, updateUser, deleteUser, fetchSelf } = require("../controllers/auth.controller")
const { requireAuth } = require("../middlewares/auth.middleware")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads") 
    },
    filename: function (req, file, cb) {
      const { _id } = req.params
      const uniqueSuffix = Date.now()
      cb(null, "profile-pic" + "." + _id + "." + uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


router.post("/login", login)

router.post("/signup", signup)

router.get("/self", requireAuth, fetchSelf)

router.patch("/profile/:_id", requireAuth, updateUser)

router.delete("/profile/:_id/:role", requireAuth, deleteUser)

router.patch("/profile/pic/:_id/:role", requireAuth, upload.single('file'), uploadProfilePic)

module.exports = router