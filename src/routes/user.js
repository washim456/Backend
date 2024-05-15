
const express = require("express")

const router = express.Router()


const { updateUser, remove, fetch, fetchAllPending, currentUser } = require("../controllers/user.controller")
const { requireAuth } = require("../middlewares/auth.middleware")


router.get("/pending", requireAuth ,fetchAllPending)

router.get("/users/token", requireAuth, currentUser)

router.get("/users/:_id", requireAuth, fetch)

router.patch("/users/:_id", requireAuth, updateUser)

router.delete("/users/:_id", requireAuth, remove)

module.exports = router