var express = require("express");
let router = express.Router();

router.get("/", function (req, res) {
    res.send("hello");
});


module.exports = router;