
const express = require("express")

const router = express.Router()


const { fetchAll } = require("../controllers/org.controller")
const { requireAuth } = require("../middlewares/auth.middleware")


router.get("/organisation", requireAuth, fetchAll)

module.exports = router