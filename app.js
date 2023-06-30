const express = require("express");
const app = express();
app.use(express.json());
const { getTopics, getDescriptions,getArticleId, getArticles, getCommentsByArticleId, postComments } = require("./controller/app.controller");
const { handlePsqlErrors, handleDefaultErrors, handleServerErrors } = require('./app.errors')
app.get("/api/topics", getTopics);
app.get("/api", getDescriptions);
app.get('/api/articles/:article_id', getArticleId)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComments)

app.use(handlePsqlErrors)
app.use(handleDefaultErrors)
app.use(handleServerErrors)
module.exports = app;
