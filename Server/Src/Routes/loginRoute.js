const express = require('express')
const loginController = require('../Controllers/loginController')

const router = express.Router()

//Login Route for all users
//--------------------------
router.post('/all',loginController.loginForAllUsertType)

module.exports = router
  