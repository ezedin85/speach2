const { default: mongoose } = require('mongoose')
const questionsModel = require('../models/questionModel')


const getQuestions = async (req, res)=>{
    const {level, pack} = req.query
    if(!level || !pack){
        return res.status(400).json({error: "please provide all required search parameters."})
    } 

    const questions = await questionsModel.find({level}).skip(pack*36).limit(36).select('-answer')

    res.json(questions)
}

const getAnswers = async (req, res)=>{
    const {level, pack} = req.query
    if(!level || !pack){
        return res.status(400).json({error: "please provide all required search parameters."})
    }

    const questions = await questionsModel.find({level}).skip(pack*36).limit(36).select('answer')

    res.json(questions)

}


const addQuestion = async (req, res)=>{
    const {level, question, opt1, opt2, opt3, opt4, answer} = req.body

    if(!level || !question || !opt1 || !opt2 || !opt3 || !opt4 || !answer){
        res.status(400).json({error: "all fields must be filled"})
    }

    try {
        const ques = await questionsModel.create({level, question, opt1, opt2, opt3, opt4, answer})
        res.json(ques)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deleteQuestion = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

    const deleteQuestion = await questionsModel.findOneAndDelete({_id: id})

    if(!deleteQuestion){
        return res.status(400).json({error: "no such workout found"})
    }

    res.json(deleteQuestion)
}

const getQuestion = async(req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

        const question = await questionsModel.findById({_id: id})
        
        if(!question){
            return res.status(400).json({error: "no such question found"})
        }
        res.json(question)
}

const getAllQuestions = async(req, res)=>{
    const {level, page} = req.query
    
    if(!level){
        // const questions = await questionsModel.find({}).skip(page? (page - 1) * 20 : 0).limit(20)
        const questions = await questionsModel.find({}).skip(page? (page - 1) * 20 : 0)
        return res.json(questions)
    }

    // const questions = await questionsModel.find({level}).skip(page? (page - 1) * 20 : 0).limit(20)
    const questions = await questionsModel.find({level}).skip(page? (page - 1) * 20 : 0)
    res.json(questions)
}

const updateQuestion = async (req, res)=>{   
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

    try {
        const updatedQuestion = await questionsModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        res.json(updatedQuestion)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

module.exports = {
    addQuestion,
    getQuestions,
    getAnswers,
    deleteQuestion,
    getAllQuestions,
    getQuestion,
    updateQuestion
}