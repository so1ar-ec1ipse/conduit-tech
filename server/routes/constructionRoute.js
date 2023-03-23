const express = require("express");
const router = express.Router();
const constructionController = require("../controller/constructionController");

router.get("/form-next-step", constructionController.getNextField);

module.exports = router;
