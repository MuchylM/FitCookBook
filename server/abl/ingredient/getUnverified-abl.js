const path = require("path");
const Ajv = require("ajv").default;
const UnverifiedIngredientDao = require("../../dao/ingredient-dao");
let dao = new UnverifiedIngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string" }
  },
  "required": ["id"]
};

async function GetUnverifiedAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;

    const valid = ajv.validate(schema, body);
    if (valid) {
      const ingredientId = body.id;
      const unverifiedIngredient = await dao.getUnverifiedIngredient(ingredientId);
      if (!unverifiedIngredient) {
        res.status(400).send({error: `Unverified ingredient with id '${ingredientId}' doesn't exist.`});
      }
      res.json(unverifiedIngredient);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = GetUnverifiedAbl;
