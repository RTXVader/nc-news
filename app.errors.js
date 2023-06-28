exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err);
    res.status(400).send({ msg: "Bad Request" });
  }
};
