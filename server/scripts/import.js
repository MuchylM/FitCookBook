const FormData = require('form-data');
const fs = require("fs");
const path = require("path");
const neatCsv = require('neat-csv');
const { mainModule } = require("process");
const axios = require('axios').default;

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

class Import {
    constructor() {
        this.ingredientToImportList = [];
        this.ingredientImportedList = [];
        this.ingredientNotImportedList = [];
        this.ingredientBeingImported = {};
        //this.authorMap = null;
    }

    async getIngredientsList() {
        const inputFile = await rf(path.join(__dirname, "ingredients_import.csv"));
        this.ingredientToImportList = await neatCsv(inputFile.toString())
    }

    getIngredientToImport(i) {
        this.ingredientBeingImported = this.ingredientToImportList[i];
    }

    async importIngredient() {
        try {
            //await this._importAuthors();
            await this._importIngredient();
            await this._importImage();
            // everything was OK, ingredient is imported
            this.ingredientImportedList.push(this.ingredientBeingImported);
        } catch (e) {
            // ingredient failed to import, ingredient is imported to notImportedList
            this.ingredientBeingImported.error = e;
            this.ingredientNotImportedList.push(this.ingredientBeingImported);
        }
    }
    /*
    async _importAuthors() {
        // ověřit, jestli existuje AuthorMap - přehled všech autorů
        if (!this.authorMap) {
            // při prvním spuštění, pokud neexistuje - stáhne seznam knih a vytvoří autorMap
            // autorMap je objekt { "Jméno Příjmení": "id" } se všemi autory
            this.authorMap = {};
            const authorListResponse = await axios.get('http://localhost:3000/author/list');
            authorListResponse.data.forEach(author => {
                this.authorMap[`${author.firstname} ${author.lastname}`] = author;
            })
        }
        // převést seznam autorů na pole (u jedné knihy může být více autorů, například "Stephen Baxter, Arthur C. Clarke")
        const authorToImportList = this.bookBeingImported.author.split(",");
        this.bookBeingImported.authorList = [];
        // ověřit, jestli existuje autor importované knihy
        for (let j = 0; j < authorToImportList.length; j++) {
            // odebrat mezery na začátku / na konci autora - například z "Stephen Baxter, Arthur C. Clarke" vznikne ["Stephen Baxter", " Arthur C. Clarke"]
            const authorName = authorToImportList[j].trim();
            if (this.authorMap[authorName]) {
                this.bookBeingImported.authorList.push(this.authorMap[authorName].id);
            } else {
                // poslední část jména je příjmení, vše před je křestní jméno, například "Arthur C.", "Clarke"
                const authorNameSplit = authorName.split(" ");
                const lastname = authorNameSplit.pop();
                const firstname = authorNameSplit.join(" ");
                // zavolat author/create server rozhraní
                const newAuthorResponse = await axios.post('http://localhost:3000/author/create', {
                    firstname: firstname,
                    lastname: lastname,
                });
                // přidat nově vytvořené ID do seznamu ID k importu knihy
                this.bookBeingImported.authorList.push(newAuthorResponse.data.id)
                // přidat nového autora do this.authorMap
                this.authorMap[`${authorName}`] = newAuthorResponse.data;
            }
        }
    }
    */
    async _importIngredient() {
        // s pomocí vybraných informací z this.ingredientBeingImported vytvořit novou ingredienci
        const newIngredientResponse = await axios.post('http://localhost:4269/ingredient/create', {
            name: this.ingredientBeingImported.name,
            unitOfMeasurement: this.ingredientBeingImported.unitOfMeasurement,
            healthyIngredient: this.ingredientBeingImported.healthyIngredient
        });
        this.ingredientBeingImported.id = newIngredientResponse.id;
    }

    async _importImage() {
        const formData = new FormData();
        formData.append('id', this.ingredientBeingImported.id);
        formData.append('data', await fs.createReadStream(path.join(__dirname, "ingredientsImages", this.ingredientBeingImported.image)));
        const newIngredientImageResponse = await axios.post('http://localhost:4269/ingredientImage/create', formData, {
            headers: formData.getHeaders()
        });
    }

    // uložit výsledky importu do samostatných souborů
    async storeResult() {
        const timeTs = new Date().toISOString().replace(/[^0-9]/g, "")
        await wf(path.join(__dirname, `${timeTs}_success.json`), JSON.stringify(this.ingredientImportedList, null, 2))
        await wf(path.join(__dirname, `${timeTs}_failed.json`), JSON.stringify(this.ingredientNotImportedList, null, 2))
    }
}

async function main() {
    const myImport = new Import();
    await myImport.getIngredientsList()
    for (let i = 0; i < myImport.ingredientToImportList.length; i++) {
        myImport.getIngredientToImport(i);
        await myImport.importIngredient();
    }
    await myImport.storeResult();
}

main()
