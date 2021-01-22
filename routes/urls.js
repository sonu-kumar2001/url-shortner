const express = require("express");
const router = express.Router();
const isValidUrl = require("valid-url");
const Url = require("../models/Url");
const urlCodeGenerator = require("shortid");
const auth = require("../modules/config");

router.get("/:code", async (req, res, next) => {
  const urlCode = req.params.code;
  try {
    if (urlCodeGenerator.isValid(urlCode)) {
      let url = await Url.findOne({ urlCode: urlCode });
      if (url) {
        await Url.findByIdAndUpdate(
          url.id,
          { $inc: { numberOfClick: 1 } },
          { new: true }
        );
        res.status(200).redirect(url.urlLong);
      } else {
        next("Link Is Invalid");
      }
    } else {
      next("url is not valid");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", auth.currentUserLoggedIn, async (req, res, next) => {
  let longUrl = req.body.url;
  let author = req.user ? req.user.id : null;
  try {
    if (isValidUrl.isUri(longUrl)) {
      let urlCode = urlCodeGenerator.generate();
      let url = await Url.create({
        urlLong: longUrl,
        urlShort: `http://localhost:3000/${urlCode}`,
        urlCode: urlCode,
        author: author,
      });
      console.log(url);
      res.status(200).render("link", { url });
    } else {
      next("Url Is not Valid");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
