const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))
//const RecipeDao = require("../../dao/recipe-dao");
//let recipeDao = new AuthorDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string" }
  },
  "required": ["id"]
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;

    const valid = ajv.validate(schema, body);
    if (valid) {
      const ingredientId = body.id;
      const ingredient = await dao.getIngredient(ingredientId);
      if (!ingredient) {
        res.status(400).send({error: `Ingredient with id '${ingredientId}' doesn't exist.`});
      }
      res.json(ingredient);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("Ingredient with given id ")) {
      res.status(400).send({ errorMessage: e.message, params: req.body })
    }
    res.status(500).send(e)
  }
}

module.exports = GetAbl;
