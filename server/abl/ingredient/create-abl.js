const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))
//const RecipeDao = require("../../dao/recipe-dao");
//let recipeDao = new AuthorDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

let schema = {
  "type": "object",
  "properties": {
    "id" : {"type": "string"},
    "name": { "type": "string" },
    "unitOfMeasurement": { "type": "string" },
    "healthyIngredient": { "type": "boolean" },
    "status" : {"type": "string"}
  },
  "required": ["name", "unitOfMeasurement", "healthyIngredient"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let ingredient = req.body;
      ingredient = await dao.createIngredient(ingredient);
      res.json(ingredient);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("Ingredient with given name ")) {
      res.status(400).send({ errorMessage: e.message, params: req.body })
    }
    res.status(500).send(e)
  }
}

module.exports = CreateAbl;
