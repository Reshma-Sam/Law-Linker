const express = require ('express')
const caseCategoryController = require('../Controllers/caseCatogoryControllers')

const router = express.Router()

//GET : Retrieving all Advocates & Jr. Advocates by Specialization
//-----------------------------------------------------------------
router.get('/advocates/specialization',caseCategoryController.getAdvocatesBySpecialization)

module.exports = router