const {
  gettingTopics,
  gettingArticleById,
  gettingArticles,
  gettingCommentsByArticleId,
  postingComments,
  patchingArticleVotes,
  deletingCommentById,
  gettingUsers
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
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return gettingArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  

  return gettingArticles(topic, sort_by, order) 
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
  
   
  
    return patchingArticleVotes(article_id, inc_votes)
      .then((article) => {
        
        res.status(200).send({ article });
      })
      .catch(next);
  };
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deletingCommentById(comment_id)
  
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  return gettingUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};