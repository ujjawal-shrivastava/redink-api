const api = require("express").Router();

api.use("/ping", async (req, res) => {
  res.send("Pong");
});

api.use("/posts", require("./post"));
api.use("/authors", require("./author"));

module.exports = api;
