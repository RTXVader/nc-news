const { gettingTopics, gettingArticlesId, gettingArticles } = require("../modele/app.model");
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
  return gettingArticlesId(article_id).then((article) => {
    return res.status(200).send({ article: article });
  })
  .catch(next)
};
exports.getArticles = (req, res, next) => {
    const { sort_by, order, category_id } = req.query
    
    return gettingArticles(sort_by, order, category_id).then((articles) => {
      return res.status(200).send({ articles: articles });
    })
    .catch(next)
}
