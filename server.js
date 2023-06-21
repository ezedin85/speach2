require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const questionRoutes = require('./routes/questionRoutes')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const messageRoute = require('./routes/messageRoute')

//creating express app
const app = express()

// middlewares
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.json())

app.use('/api/question', questionRoutes)
app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/message', messageRoute)

//connecting to the databasea and listening to the server
mongoose.connect(process.env.URI)
.then(()=>{
    app.listen(process.env.PORT, ()=>console.log("Listenting"))
})
.catch(error=>console.log(error))
