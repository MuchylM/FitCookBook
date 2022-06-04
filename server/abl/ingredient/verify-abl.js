const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

let schema = {
  "type": "object",
  "properties": {
    "id" : {"type": "string"},
    "verificationStatus": {"type" : "boolean"}
  },
  "required": ["id", "verificationStatus"]
};

async function VerifyAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let ingredientId = req.body.id;
      let verificationStatus = req.body.verificationStatus;
      let ingredient = await dao.verifyIngredient(ingredientId, verificationStatus);
      res.json(ingredient);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
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

module.exports = VerifyAbl;
