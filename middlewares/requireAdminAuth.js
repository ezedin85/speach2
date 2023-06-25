const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')
require('dotenv').config()

const adminAuth = async (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "Authorization required!"})
    }

    try {
        const token = authorization.split(' ')[1]
        const {id} = jwt.verify(token, process.env.SECRET)
        await adminModel.findOne({_id: id})//why
        next()
    } catch (error) {
        res.status(401).json({error: "request isn't authorized"})
    }
}

module.exports = adminAuth