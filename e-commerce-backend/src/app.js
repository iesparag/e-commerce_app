const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const routesArray = require("./routes");
const cors = require("cors");
const {corsMiddleware} = require("./cors/corsConfig");
const { handlePaymentWebhook } = require("./controllers/buyerController/payment.buyer.controller");

app.use(cors("*"));
app.post(
  "/api/v1/buyer/payment/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

// Use JSON parser for all other routes
app.use(bodyParser.json());
// app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/apple", (req, res) => {
    res.send("Welcome to my app!");
});

routesArray?.forEach(({ path, handler }) => {
    app.use(path, handler);
});



module.exports = { app };
