var express = require("express");
var router = express.Router();

var ctrlAdmin = require("../controllers/admin");

router.get("/admin", ctrlAdmin.admin);
router.get("/admin/:id", ctrlAdmin.admin);

module.exports = router;