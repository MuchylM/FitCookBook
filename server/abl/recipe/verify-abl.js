const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

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
      let recipeId = req.body.id;
      let verificationState = req.body.verificationStatus;
      let recipe = await dao.verifyRecipe(recipeId, verificationState);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("Recipe with given id ")) {
      res.status(400).send({ errorMessage: e.message, params: req.body })
    }
    res.status(500).send(e)
  }
}

module.exports = VerifyAbl;