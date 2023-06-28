const express = require('express')
const app =express()
const { getTopics, getDescriptions} = require('./controller/app.controller')



app.get('/api/topics', getTopics)
app.get('/api', getDescriptions)
module.exports = app