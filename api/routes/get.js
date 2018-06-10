const express = require("express");
const path = require("path");
const CommentsOnPlace = require("../models/comments");

const router = express.Router();

router.get("/all", (req, res) => {
  CommentsOnPlace.find()
  .exec((err, doc) => {
    if (err) res.send(err);
    if (doc) {
      res.send(doc);
    } else {
      res.send("нет отзывов");
    }
  });
});
router.get("/:address", (req, res) => {
  let address = req.params.address.toLowerCase();

  CommentsOnPlace.find({ address: address })
    .select({ address: 1, name: 1, place: 1, text: 1, date: 1 })
    .exec((err, doc) => {
      if (err) res.send(err);
      if (doc) {
        res.set("Content-Type", "text/html");
        res.render(path.join(__dirname, "../../views/config/list-item"), {
          comments: doc
        });
      } else {
        res.send("нет отзывов");
      }
    });
});
module.exports = router;
