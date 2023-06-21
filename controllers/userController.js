require('dotenv').config()
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const { default: mongoose } = require('mongoose')

const createToken = (id) =>{
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '3d'})
}

const signup = async (req, res)=>{
    const {contact, password, confirmPwd, fullName, email, level} = req.body
    try {
        const user = await userModel.signup(contact, password, confirmPwd, fullName, email, level)
        if(user.error){
            if(user.emptyFields){
                return res.status(400).json({error: user.error, emptyFields: user.emptyFields})
            }
            return res.status(400).json({error: user.error})
        }
        
        const token = createToken(user._id)
        res.status(201).json({token, fullName: user.fullName})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const login = async (req, res)=>{
    const {contact, password} = req.body
    try {
        const user = await userModel.login(contact, password)
        const token = createToken(user._id)
        res.json({token, fullName: user.fullName})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


const getUser = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

    const user = await userModel.findOne({_id: id}).select("-password")
    if(!user){
        return res.status(404).json({error: "no user found"})
    }

    res.json(user)
}

const getMe = async (req, res)=>{ 
    const {id} = req.userId; 
    const user = await userModel.findOne({_id: id}).select("-password")
    if(!user){//maybe not needed
        return res.status(404).json({error: "no user found"})
    }
    res.json(user)
}

const getUsers = async (req, res)=>{
    let {page} = req.query
    const users = await userModel.find({}).skip(page? (page - 1) * 20 : 0).limit(20)
    res.json(users)
}

const deleteUser = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

    const user = await userModel.findOneAndDelete({_id: id})
    if(!user){
        return res.status(404).json({error: "no user found"})
    }

    res.json(user)
}

const updateMe = async (req, res)=>{
    const { id } = req.userId
    // const {fullName, contact, prevPassword, password, confirmPwd, email} = req.body
    const {fullName, contact, email} = req.body
    
    try {
        const updatedData = await userModel.findByIdAndUpdate(id, {fullName, contact, email}, {new: true, runValidators: true})
        res.json(updatedData)
    } catch (error) {
        res.status(404).json("user not found")
    }
}

const updateUser = async (req, res)=>{
}

const incExam = async (req, res)=>{
    const { id } = req.userId
    try {
        const updatedData = await userModel.findByIdAndUpdate(id, { $inc: { taken_exams: 1 } }, {new: true, runValidators: true}).select("-password")
        res.json(updatedData)
    } catch (error) {
        res.status(404).json("user not found")
    }
}

const incTraining = async (req, res)=>{
    const { id } = req.userId
    try {
        const updatedData = await userModel.findByIdAndUpdate(id, { $inc: { taken_trainings: 1 } }, {new: true, runValidators: true}).select("-password")
        res.json(updatedData)
    } catch (error) {
        res.status(404).json("user not found")
    }
}


const getPublicInfo = async (req, res)=>{
    const allStudents = await userModel.find({}).count()
    const level3Students = await userModel.find({level: 3}).count()
    const level4Students = await userModel.find({level: 4}).count()
    const usersData = await userModel.find().select('-_id taken_trainings taken_exams')
    let total_trainings = 0
    let total_exams = 0
    for (const userData of usersData) {
        total_exams += userData.taken_exams
        total_trainings += userData.taken_trainings
    }
    res.json({allStudents, level3Students, level4Students, total_trainings, total_exams });
}



module.exports = {
    signup,
    login,
    getUser,
    getMe,
    updateMe,
    getUsers,
    getPublicInfo,
    deleteUser,
    updateUser,
    incTraining,
    incExam
}