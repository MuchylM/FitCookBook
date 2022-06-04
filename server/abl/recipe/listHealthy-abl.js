const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string" }
  },
  "required": ["id"]
};

async function ListHealthyAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      const healthyRecipes = await dao.listHealthyRecipes(req.body.id);
      res.json(healthyRecipes);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("Ingredient with id ")) {
      res.status(400).send({ errorMessage: e.message, params: req.body })
    }
    res.status(500).send(e)
  }
}

module.exports = ListHealthyAbl;
