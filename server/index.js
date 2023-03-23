const express = require("express");
const constructionRoute = require("./routes/constructionRoute");
const cors = require("cors");
const { globalStore } = require("./utils/store");
const { INIT_DATA_PATH } = require("./utils/constants");

require("dotenv").config();

const app = express();
const PORT = process.env.NODE_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

globalStore.initialize(`${__dirname}${INIT_DATA_PATH}`);
app.use("/constructions", constructionRoute);

app.listen(PORT, () => console.log("Server started"));
