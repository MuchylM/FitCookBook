const express = require("express");
const router = express.Router();

const busboy = require("busboy");
const CreateAbl = require("../abl/ingredient-image/create-abl");
const GetAbl = require("../abl/ingredient-image/get-abl");

router.post("/create", (req,res) => {
  let myBusboy = busboy({ headers: req.headers, limits: {files: 1} });
  CreateAbl(myBusboy, res)
  req.pipe(myBusboy);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res)
});

module.exports = router