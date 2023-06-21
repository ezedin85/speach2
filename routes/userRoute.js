const express = require('express')
const { signup, login , getUser, getMe, updateMe, getUsers, getPublicInfo, deleteUser, updateUser, incTraining, incExam} = require('../controllers/userController')
const userAuth = require('../middlewares/requireUserAuth')
const adminAuth = require('../middlewares/requireAdminAuth')
const router = express.Router()

//public --- /api/user/signup
router.post('/signup', signup)

//public --- /api/user/login
router.post('/login', login)

//private --- /api/user
router.get('/', adminAuth, getUsers)

//private --- /api/user/me
router.get('/me', userAuth, getMe)

//private --- /api/user/me
router.patch('/me', userAuth, updateMe)

//private --- /api/user/publicInfo
router.get('/publicInfo', getPublicInfo)

//private --- /api/user/6475d4bba3462ef7387ca2d5
router.get('/:id', adminAuth, getUser)

//private --- /api/user/6475d4bba3462ef7387ca2d5 
router.delete('/:id', adminAuth, deleteUser)

//private --- /api/user/updatetraining
router.patch('/updatetraining', userAuth, incTraining)

//private --- /api/user/updateexam
router.patch('/updateexam', userAuth, incExam)

//private --- /api/user/6475d4bba3462ef7387ca2d5
router.patch('/:id', adminAuth, updateUser)

module.exports = router