const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/ingredient/create-abl");
const GetAbl = require("../abl/ingredient/get-abl");
const GetUnverifiedAbl = require("../abl/ingredient/getUnverified-abl");
const UpdateAbl = require("../abl/ingredient/update-abl");
const DeleteAbl = require("../abl/ingredient/delete-abl");
const ListAbl = require("../abl/ingredient/list-abl");
const ListUnverifiedAbl = require("../abl/ingredient/listUnverified-abl");
const ListDiscardedAbl = require("../abl/ingredient/listDiscarded-abl");
const ListHealthyAbl = require("../abl/ingredient/listHealthy-abl");
const VerifyAbl = require("../abl/ingredient/verify-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res)
});

router.get("/getUnverified", async (req, res) => {
  await GetUnverifiedAbl(req, res)
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