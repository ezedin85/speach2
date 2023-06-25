const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    contact: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    taken_exams: {
        type: Number,
        default: 0
    },
    taken_trainings: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

userSchema.statics.signup = async function (contact, password, confirmPwd, fullName, email, level) {
    //checking if there is any unfilled input
    const emptyFields = []
    if(!contact) emptyFields.push("contact")
    if(!password) emptyFields.push("password")
    if(!confirmPwd) emptyFields.push("confirmPwd")
    if(!fullName) emptyFields.push("fullName")
    if(!email) emptyFields.push("email")
    if(!level) emptyFields.push("level")

    if(emptyFields.length > 0){
        //if there is an empty field, stop excution and return the unfilled fields
        return {error: "Please fill in all required fields", emptyFields}
    }

    const prevUser = await this.findOne({contact})
    if(prevUser){
        throw Error("Contact already in use")
    }

    //removed to make the registration easy
    // if(!validator.isStrongPassword(password)){
    //     throw Error("Not a strong password")
    // }

    if(password !== confirmPwd){
        throw Error("passwords don't match")
    }

    //removed to make the registration easy
    // if(!validator.isEmail(email)){
    //     throw Error("not a valid email")
    // }

    //check if level is not 3 or 4
    if(level == '3' || level == '4'){
        //hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)
    
        try {
            const user = await this.create({contact, password: hashedPwd, fullName, email, level})
            return user
        } catch (error) {
            throw Error(error)
        }
    }else{
        throw Error("Sorry, Only level 3 and 4 are avaliable now.")
    }

}

userSchema.statics.login = async function (contact, password){
    if(!contact || !password){
        throw Error("pleasse provide contact and password")
    }

    //checking if the user exists
    const user = await this.findOne({contact})
    if(!user){
        throw Error("Incorrect credentials!")
    }

    //verifying the password
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("password not correct")
    }

    return user
}

module.exports = mongoose.model('User', userSchema)