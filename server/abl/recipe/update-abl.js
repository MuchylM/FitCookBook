
///////////TODO///////////

const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

var innerSchema = {
  "type" : "object",
  "properties" : {
    "ingredientId": {"type": "string"},
    "name": {"type": "string"},
    "amount": {"type": "integer"}
  },
  "required" : ["ingredientId", "name", "amount"]
}
  
var innerArraySchema = {
  "type": "array",
  "items" : innerSchema
}

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "numberOfPortions": { "type": "integer" },
    "ingredientsList": innerArraySchema,
  "Method": {"type": "string"},
  "Image": {"type": "string"}
  },
  "required": ["id"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let recipe = req.body
    const valid = ajv.validate(schema, recipe);
    if (valid) {
      recipe = await dao.updateRecipe(recipe);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: book,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.startsWith("Recipe with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e)
  }
}

module.exports = UpdateAbl;
