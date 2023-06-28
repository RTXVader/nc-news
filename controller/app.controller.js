const { gettingTopics, gettingDescriptions } = require("../modele/app.model");
const endpoints = require("../endpoints.json");
exports.getTopics = (req, res) => {
  return gettingTopics().then((topics) => {
    return res.status(200).send({ topics: topics });
  });
};
exports.getDescriptions = (req, res) => {
  console.log("controller");


  return res.status(200).send({ description: endpoints });
};
