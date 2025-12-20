const express = require("express");
const router = express.Router();
const LanguageController = require("../controller/language.controller");

router.post("/add", LanguageController.addLanguage);
router.get("/list", LanguageController.getLanguages);
router.get("/:id", LanguageController.getLanguageById);
router.put("/:id", LanguageController.updateLanguage);
router.delete("/:id", LanguageController.deleteLanguage);

module.exports = router;
