const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

let schema = {
  "type": "object",
  "properties": {},
  "required": []
};

async function ListUnverifiedAbl(req, res) {
  try {
    const unverifiedRecipes = await dao.listUnverifiedRecipes();
    res.json(unverifiedRecipes);
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = ListUnverifiedAbl;
