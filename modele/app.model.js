const db = require("../db/connection");
const endpoints = require("../endpoints.json");
exports.gettingTopics = () => {
  const query = "SELECT slug, description FROM topics;";

  return db.query(query).then((result) => {
    return result.rows;
  });
};
exports.gettingArticleById = (article_id) => {
  const query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  return db.query(query, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return result.rows[0];
  });
};

exports.gettingArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  const greenList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  if (!greenList.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryValues = [];
  let query = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    query += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  query += ` GROUP BY articles.article_id`;

  if (sort_by) {
    query += ` ORDER BY ${sort_by} ${order};`;
  }

  return db.query(query, queryValues).then((result) => {
    return result.rows;
  });
};

exports.gettingCommentsByArticleId = (article_id) => {
  const articleQuery = `
    SELECT EXISTS (
      SELECT *
      FROM articles
      WHERE article_id = $1
    );
  `;

  const query = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;

  return db.query(articleQuery, [article_id]).then(({ rows }) => {
    const articleExists = rows[0].exists;
   
    if (!articleExists) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }

    return db.query(query, [article_id]).then(({ rows }) => {
      return rows;
    });
  });
};
exports.postingComments = (article_id, username, body) => {
  

  
  const query = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  

 

return db.query(query, [article_id, username, body])
    .then(({ rows }) => {
 

      return rows[0]
    });
 
};
exports.patchingArticleVotes = (articleId, incVotes) => {
  const query = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

 

  return db.query(query, [incVotes, articleId])
  
    .then((result) => {
   
    if(result.rows.length === 0) {
      return Promise.reject({ status: 404, code: '23503' });
    }
    return result.rows[0]
});
};
exports.deletingCommentById = (commentId) => {
  const checkQuery = `
    SELECT EXISTS (
      SELECT *
      FROM comments
      WHERE comment_id = $1
    );
  `;

  const deleteQuery = `
    DELETE FROM comments
    WHERE comment_id = $1;
  `;

  

  return db.query(checkQuery, [commentId])
    .then(({ rows }) => {
      const commentExists = rows[0].exists;

      if (!commentExists) {
        throw {
          status: 404,
          msg: 'Not Found',
        };
      }

      return db.query(deleteQuery, [commentId])
      
    });
};
exports.gettingUsers = () => {
  return db.query('SELECT * FROM users').then((result) => {
    return result.rows;
  });
};


