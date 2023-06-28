exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.handleDefaultErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Unknown Error" });
};
