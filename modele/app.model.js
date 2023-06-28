const db = require("../db/connection");
const endpoints = require("../endpoints.json");
exports.gettingTopics = () => {
  const query = "SELECT slug, description FROM topics;";

  return db.query(query).then((result) => {
    return result.rows;
  });
};
exports.gettingArticles = (article_id) => {
  const query = "SELECT * FROM articles WHERE article_id = $1;";
  return db.query(query, [article_id]).then((result) => {
    return result.rows[0];
  });
};
