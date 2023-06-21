require('dotenv').config()
const { default: mongoose } = require('mongoose')
const adminModel = require("../models/adminModel")
const jwt = require("jsonwebtoken")

const createToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET, {expiresIn: "3d"})
}

const signup = async (req, res)=>{
    const {username, password, confirmPwd} = req.body
    try {
        const user = await adminModel.signup(username, password, confirmPwd)
        const token = createToken(user._id)
        res.status(201).json({token, username})
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
}

const login = async (req, res)=>{
    const {username, password} = req.body
    try {
        const user = await adminModel.login(username, password)
        const token = createToken(user._id)
        res.json({token, username})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getAdmin = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }
    
    const admin = await adminModel.findOne({_id: id}).select("-password")
    if(!admin){
        return res.status(400).json({error: "no admin found"})
    }
    res.json(admin)
}

const getAdmins = async (req, res)=>{
    const admins = await adminModel.find({})
    res.json(admins)
}

const deleteAdmin = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }

    const admin = await adminModel.findOneAndDelete({_id: id})
    if(!admin){
        return res.status(404).json({error: "no admin found"})
    }

    res.json({admin: admin.username})
}

module.exports = {
    signup,
    login,
    getAdmin,
    getAdmins,
    deleteAdmin
}