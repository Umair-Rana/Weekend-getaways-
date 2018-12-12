 var express = require("express");
var router = express.Router();
//MISSING
var ctrlContact = require("../controllers/navbar");

router.get("/", ctrlContact.home);
router.get("/home2/", ctrlContact.home2);
router.get("/contact/", ctrlContact.contact);
router.post("/contact/", ctrlContact.contactP);
router.get("/about/", ctrlContact.about);
router.get("/blog/", ctrlContact.blog);
router.get("/login/", ctrlContact.login);
router.post("/login/", ctrlContact.loginP);
router.get("/signup/", ctrlContact.signup);
router.post("/signup/",ctrlContact.signupP);
router.get("/admin/:adminId", ctrlContact.admin);
router.get("/admin/:adminId/users", ctrlContact.admin_user);
router.get("/admin/:adminId/trippss", ctrlContact.admin_trip);
router.get("/admin/:adminId/signout", ctrlContact.admin_signout);
router.get("/admin/:adminId/contacts/:contactId", ctrlContact.admin_contact_delete);
router.get("/admin/:adminId/reviews/:reviewId", ctrlContact.admin_reviews_delete);
router.get("/admin/:adminId/trippss/:tripId", ctrlContact.admin_trip_delete);
router.post("/admin/:adminId/trippss", ctrlContact.admin_addtrip);
router.get("/admin/:adminId/contacts", ctrlContact.admin_contact);
router.get("/admin/:adminId/reviews", ctrlContact.admin_review);
router.get("/admin/:adminId/edit", ctrlContact.admin_edit);
router.post("/admin/:adminId/edit", ctrlContact.admin_editP);
router.get("/user/:userId", ctrlContact.user);
router.get("/trip/:tripId", ctrlContact.trip);
//router.get("/edits/", ctrlContact.admin_edit);
//router.post("/edits/", ctrlContact.admin_editP);

module.exports = router;