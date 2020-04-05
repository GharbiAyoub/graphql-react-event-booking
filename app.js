const express = require("express");
const bodyParser = require("body-parser");

const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolver = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth")
const app = express();
const events = [];
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send({
    msg: "Welcome to Index !!!"
  });
});

app.use(isAuth);
app.use(
  "/graphQl",
  graphqlHttp({
    schema: graphQlSchema  ,
    rootValue: graphQlResolver,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-cpcy3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen("3000");
    console.log("App running in http://localhost:30000");
  })
  .catch(err => {
    console.log(err);
  });
