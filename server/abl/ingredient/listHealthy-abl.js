const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

let schema = {
  "type": "object",
  "properties": {},
  "required": []
};

async function ListHealthyAbl(req, res) {
  try {
    const healthyIngredients = await dao.listHealthyIngredients();
    res.json(healthyIngredients);
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = ListHealthyAbl;
