const express = require('express')
const router = express.Router()
const userAuth = require('../middlewares/requireUserAuth')
const adminAuth = require('../middlewares/requireAdminAuth')
const {addQuestion,
    getQuestions,
    getAnswers,
    deleteQuestion,
    getAllQuestions,
    getQuestion,
    updateQuestion
} = require('../controllers/questionController')

//private---/api/question?startFrom=4&level=3
router.get('/', userAuth, getQuestions)

//private---/api/question/answer?startFrom=4&level=3 
router.get('/answer', userAuth, getAnswers)

//private---/api/question
router.post('/', adminAuth, addQuestion)

//private---/api/question/all?level=4
router.get('/all', adminAuth, getAllQuestions)

//private --- api/question/6475d4bba3462ef7387ca2d5
router.get('/:id', adminAuth, getQuestion)

//private --- api/question/6475d4bba3462ef7387ca2d5
router.delete('/:id', adminAuth, deleteQuestion)

//private --- api/question/649048915040c5edf019d13b
router.patch('/:id', adminAuth, updateQuestion)




module.exports = router