const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json());
const { getTopics, getDescriptions,getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticleVotes, deleteCommentById, getUsers } = require("./controller/app.controller");
const { handlePsqlErrors, handleDefaultErrors, handleServerErrors } = require('./app.errors')
app.get("/api/topics", getTopics);
app.get("/api", getDescriptions);
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentById);


app.use(handlePsqlErrors)
app.use(handleDefaultErrors)
app.use(handleServerErrors)
module.exports = app;
