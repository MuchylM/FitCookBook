const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

let schema = {
  "type": "object",
  "properties": {},
  "required": []
};

async function ListDiscardedAbl(req, res) {
  try {
    const discardedIngredients = await dao.listDiscardedIngredients();
    res.json(discardedIngredients);
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = ListDiscardedAbl;
