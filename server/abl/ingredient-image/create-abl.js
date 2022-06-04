const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

const createIngredientImageSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
    },
    "required": ["id"]
};

async function CreateAbl(busboy, res) {
    let dtoIn = {};
    // textová část multipartu, ze které složíme vstup naší routy k validaci
    busboy.on("field", function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        dtoIn[fieldname] = val;
    });

    // budeme předpokládat, že soubor se v multipartu uvádí jako poslední pro jednoduchost
    busboy.on("file", async (name, file, info) => {
        const { mimeType } = info;

        // validace vstupu
        const ajv = new Ajv();
        const valid = ajv.validate(createIngredientImageSchema, dtoIn);

        // nevalidní vstup
        if (!valid) {
            return res.status(400).json({ error: ajv.errors });
        }

        // ověření, že ingredience existuje, aby nemohl existovat samotný obrázek
        const ingredient = await dao.getIngredient(dtoIn.id);
        if (!ingredient) {
            return res.status(400).json({ error: `Ingredient with code '${dtoIn.id}' doesn't exist.` });
        }

        // omezení, že obrázek musí být ve formátu .png, aby nebylo možné nahrát jiný soubor
        if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
            return res.status(400).json({ error: `Only supported mimeType is image/png and image/jpeg` });
        }

        // soubor si ukládáme pod id dané ingredience pro následné snadné dohledání
        let saveTo = path.join(__dirname, "..", "..", "storage", "ingredientImages", dtoIn.id + ".png");
        let writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);
    });

    // úspěšně se nahrál obrázek
    busboy.on("finish", function () {
        res.json({ status: "File succesfully uploaded!" });
    });

    // nastala chyba během přenosu
    busboy.on("error", err => {
        res.json({ error: err })
    });
}

module.exports = CreateAbl;