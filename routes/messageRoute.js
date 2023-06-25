const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const adminAuth = require('../middlewares/requireAdminAuth')
const express = require('express')
const router = express.Router()


// private --- /api/message
router.get('/', adminAuth, async(req, res)=>{
    const messages = await messageModel.find({})
    res.json(messages)
})

// public --- /api/message
router.post('/', async (req,res)=>{
    const {name, contact, message} = req.body
    if(!message){
        return res.status(400).json({error: "please provide your message" })
    }
    try {
        const msg = await messageModel.create({name, contact, message})
        res.json(msg)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.delete('/:id', adminAuth, async (req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "not a valid id"})
    }
    const message = await messageModel.findOneAndDelete({_id: id})
    if(!message){
        return res.status(404).json({error: "message not found"})
    }
    res.json({contact: message.contact})
})


module.exports = router