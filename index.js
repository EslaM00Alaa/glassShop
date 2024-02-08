const isReady = require("./database/dbready");
const sanitizeInput = require("./middlewares/sanitizeinput");

require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT,
  helmet = require("helmet"),
  client = require("./database/db");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());


app.use("/api/admin",sanitizeInput, require("./routes/admin"));
app.use("/api/user",sanitizeInput, require("./routes/user"));
app.use("/api/classification", sanitizeInput,require("./routes/classifications"));
app.use("/api/type", sanitizeInput,require("./routes/types"));
app.use("/api/glasses", sanitizeInput,require("./routes/glasses"));
app.use("/api/glassesProduct", sanitizeInput,require("./routes/glassesProducts"));
app.use("/api/lensesProduct", sanitizeInput,require("./routes/lensesproduct"));
app.use("/api/lenses",sanitizeInput ,require("./routes/lenses"));
app.use("/api/basket",sanitizeInput ,require("./routes/basket/addToBasket"));
app.use("/api/offer",sanitizeInput ,require("./routes/offer"));
app.use("/api/offerproduct",sanitizeInput ,require("./routes/offerproducts"));
app.use("/api/product",sanitizeInput ,require("./routes/productPage"));

app.get("/", (req, res) => res.send("Hello World!"));

client
  .connect()
  .then(async() => {
    console.log("psql is connected ..");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
    await isReady();
  })
  .catch((error) => console.log(error));
