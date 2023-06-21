const express = require('express')
const { signup, login , getAdmin, getAdmins, deleteAdmin} = require('../controllers/adminController')
const adminAuth = require('../middlewares/requireAdminAuth')
const router = express.Router()

//private --- /api/admin/signup
router.post('/signup', adminAuth, signup)

//public --- /api/admin/login
router.post('/login', login)

//private --- /api/admin/6475d4bba3462ef7387ca2d5
router.get('/:id', adminAuth, getAdmin)

//private --- /api/admin
router.get('/', adminAuth, getAdmins)

//private --- /api/admin/6475d4bba3462ef7387ca2d5
router.delete('/:id', adminAuth, deleteAdmin)

module.exports = router