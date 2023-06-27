const { gettingTopics } = require('../modele/app.model')

exports.getTopics = (req, res) => {
    
    return gettingTopics().then((topics) => {
       
     return   res.status(200).send({ topics: topics})
    })
}