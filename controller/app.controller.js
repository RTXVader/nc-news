const {
  gettingTopics,
  gettingArticlesId,
  gettingArticles,
  gettingCommentsByArticleId,
  postingComments,
  patchingArticleVotes
} = require("../modele/app.model");
const endpoints = require("../endpoints.json");
const { articleData } = require("../db/data/test-data");
exports.getTopics = (req, res) => {
  return gettingTopics().then((topics) => {
    return res.status(200).send({ topics: topics });
  });
};
exports.getDescriptions = (req, res) => {
  return res.status(200).send({ description: endpoints });
};
exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return gettingArticlesId(article_id)
    .then((article) => {
      return res.status(200).send({ article: article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  const { sort_by, order, category_id } = req.query;

  return gettingArticles(sort_by, order, category_id)
    .then((articles) => {
      return res.status(200).send({ articles: articles });
    })
    .catch(next);
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return gettingCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments: comments });
    })
    .catch(next);
};
exports.postComments = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body;
   
    return postingComments(article_id, username, body)
    .then((comment) => {
       
      res.status(201).send({ comment });
    })
    .catch(next
    )
       
};
exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
  
   
  console.log('controller')
  console.log( article_id, 'articleid')
  console.log(inc_votes, 'incvotes')
    return patchingArticleVotes(article_id, inc_votes)
      .then((article) => {
        
        res.status(200).send({ article });
      })
      .catch(next);
  };