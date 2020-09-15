const express = require('express')
const app = express()

const userRouter = require('../users/users-router')

app.use(express.json())
app.use('/api', userRouter)


module.exports = app