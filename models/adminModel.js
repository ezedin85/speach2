const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

adminSchema.statics.signup = async function(username, password, confirmPwd){
    if(!username || !password || !confirmPwd){
        throw Error("all fields must be filled")
    }

    const prevUser = await this.findOne({username})
    if(prevUser){
        throw Error("username already in use")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("not a strong password")
    }

    if(password !== confirmPwd){
        throw Error("passwords don't match")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(password, salt)

    try {
        const admin = await this.create({username, password: hashedPwd})
        return admin
    } catch (error) {
        throw Error(Error)        
    }
}

adminSchema.statics.login = async function (username, password) {
    if(!username || !password){
        throw Error("Please provide username and password")
    }

    const admin = await this.findOne({username})
    if(!admin){
        throw Error("Incorrect credentials!")
    }

    const match = await bcrypt.compare(password, admin.password)
    if(!match){
        throw Error("password not correct")
    }

    return admin
}

module.exports = mongoose.model('Admin', adminSchema)