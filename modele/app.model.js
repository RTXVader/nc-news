const db = require("../db/connection");
const endpoints = require("../endpoints.json");
exports.gettingTopics = () => {
  const query = "SELECT slug, description FROM topics;";

  return db.query(query).then((result) => {
    return result.rows;
  });
};
exports.gettingArticlesId = (article_id) => {
  if (article_id) {const query = "SELECT * FROM articles WHERE article_id = $1;";
  return db.query(query, [article_id]).then((result) => {
    return result.rows[0];
  });
}
return Promise.reject({ status: 404, msg: 'Bad Request'})
};
exports.gettingArticles = (category_id, sort_by = 'created_at', order = 'DESC') => {
  
  const greenList = ['author','title','article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']
  if(!greenList.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad Request'})
  }
  
  const queryValues = []
  
  let query = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
  FROM articles
   LEFT JOIN comments ON articles.article_id = comments.article_id
`;
  
  if (category_id){
    query += ` WHERE created_at = $1;`
    queryValues.push(category_id)
  }
  query += ` GROUP BY articles.article_id`

  if (sort_by){

    query += ` ORDER BY ${sort_by} ${order};`
  }

  return db.query(query, queryValues).then((result) => {
    
    return result.rows;
  });
};
