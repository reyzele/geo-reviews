const express = require("express");
const CommentsOnPlace = require("../models/comments");

const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  let address = req.body.address,
    coords = req.body.coords,
    name = req.body.name,
    place = req.body.place,
    text = req.body.text;

  CommentsOnPlace.create(
    {
      coords: coords,
      address: address,
      name: name,
      place: place,
      text: text,
      date: new Date().toISOString()
    },
    (err, comm) => {
      if (err) {
        console.log(err);
      }
      res.send(comm);
    }
  );
});
module.exports = router;
