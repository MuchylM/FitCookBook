const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/recipe/create-abl");
const GetAbl = require("../abl/recipe/get-abl");
const UpdateAbl = require("../abl/recipe/update-abl");
const DeleteAbl = require("../abl/recipe/delete-abl");
const ListAbl = require("../abl/recipe/list-abl");
const ListUnverifiedAbl = require("../abl/recipe/listUnverified-abl");
const ListDiscardedAbl = require("../abl/recipe/listDiscarded-abl");
const ListHealthyAbl = require("../abl/recipe/listHealthy-abl");
const VerifyAbl = require("../abl/recipe/verify-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res)
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res)
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res)
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res)
});

router.get("/listUnverified", async (req, res) => {
  await ListUnverifiedAbl(req, res)
});

router.get("/listDiscarded", async (req, res) => {
  await ListDiscardedAbl(req, res)
});

router.get("/listHealthy", async (req, res) => {
  await ListHealthyAbl(req, res)
});

router.post("/verify", async (req, res) => {
  await VerifyAbl(req, res)
});

module.exports = router