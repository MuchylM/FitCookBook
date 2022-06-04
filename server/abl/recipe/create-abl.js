const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

/* { "type": "Array",
    "items": [
      {"type": "object"},
      "properties": {
        "ingredientId": {"type": "string"},
        "name": {"type": "string"},
        "amount": {"type": "integer"}
        }
      ]
    }
*/

var innerSchema = {
  "type": "object",
  "properties": {
    "amount": { "type": "integer" },
    "name": { "type": "string" },
    "unitOfMeasurement": { "type": "string" },
    "healthyIngredient": { "type": "boolean" }
  },
  "required": ["name", "amount", "unitOfMeasurement", "healthyIngredient"]
}

var innerArraySchema = {
  "type": "array",
  "items": innerSchema
}

let schema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "numberOfPortions": { "type": "integer" },
    "ingredientsList": innerArraySchema,
    "method": { "type": "string" },
    "image": { "type": "string" }
  },
  "required": ["name", "numberOfPortions", "ingredientsList", "method", "image"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let recipe = req.body;
      recipe = await dao.createRecipe(recipe);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("Recipe with given name ")) {
      res.status(400).send({ errorMessage: e.message, params: req.body })
    }
    res.status(500).send(e)
  }
}

module.exports = CreateAbl;
