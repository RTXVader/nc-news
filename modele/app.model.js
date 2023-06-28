const db = require("../db/connection");
const endpoints = require("../endpoints.json");
exports.gettingTopics = () => {
  const query = "SELECT slug, description FROM topics;";

  return db.query(query).then((result) => {
    return result.rows;
  });
};
