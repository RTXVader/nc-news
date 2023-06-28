const express = require("express");
const app = express();
const { getTopics, getDescriptions,getArticleId } = require("./controller/app.controller");
const { handlePsqlErrors } = require('./app.errors')
app.get("/api/topics", getTopics);
app.get("/api", getDescriptions);
app.get('/api/articles/:article_id', getArticleId)
app.use(handlePsqlErrors)
module.exports = app;
