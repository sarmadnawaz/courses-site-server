const sendDevError = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: {
      message: err.message,
      strackTray: err.strackTray,
    },
  });
};

const sendProdError = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: {
      message: err.message,
    },
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }
};
