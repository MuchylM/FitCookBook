"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "ingredients.json");

class IngredientDao {
  constructor(storagePath) {
    this.ingredientStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createIngredient(ingredient) {
    let ingredients = await this._loadAllIngredients();
    if ((ingredients.length > 0)) {
      if ((ingredients.find(i => i.name === ingredient.name))) {
        throw new Error(`Ingredient with given name "${ingredient.name}" already exists.`);
      }
    }
    ingredient.id = crypto.randomBytes(5).toString("hex");
    ingredient.status = "Unverified";
    ingredients.push(ingredient);
    await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
    return ingredient;
  }

  async getIngredient(id) {
    let ingredients = await this._loadAllIngredients();
    const result = ingredients.find(i => i.id === id);
    if (result.status === "Unverified") {
      throw new Error(`Ingredient with given id "${id}" is not verified.`);
    }
    if (result.status === "Discarded") {
      throw new Error(`Ingredient with given id "${id}" has been discarded.`);
    }
    return result;
  }

  /*
  async getUnverifiedIngredient(id) {
    let ingredients = await this._loadAllIngredients();
    const result = ingredients.find(i => i.id === id);
    return result;
  }
  */

  async updateIngredient(ingredient) {
    let ingredients = await this._loadAllIngredients();
    const ingredientIndex = ingredients.findIndex(i => i.id === ingredient.id)
    if (ingredientIndex < 0) {
      throw new Error(`Ingredient with given id ${ingredient.id} does not exists.`);
    } else {
      ingredients[ingredientIndex] = {
        ...ingredients[ingredientIndex],
        ...ingredient
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2))
    return ingredients[ingredientIndex];
  }

  async deleteIngredient(id) {
    let ingredients = await this._loadAllIngredients();
    const ingredientIndex = ingredients.findIndex(i => i.id === id)
    if (ingredientIndex >= 0) {
      ingredients.splice(ingredientIndex, 1)
    }
    await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2))
    return {};
  }

  async listIngredients() {
    let ingredients = await this._loadAllIngredients();
    let result = [];
    for(let i = 0; i < ingredients.length; i++){
      if(ingredients[i].status == "Verified"){
        result.push(ingredients[i]);
      }
    }
    return result;
  }

  async listHealthyIngredients() {
    let ingredients = await this._loadAllIngredients();
    let healthyIngredients = [];
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].healthyIngredient) {
        healthyIngredients.push(ingredients[i]);
      }
    }
    return healthyIngredients;
  }

  async listDiscardedIngredients() {
    let ingredients = await this._loadAllIngredients();
    let result = [];
    for(let i = 0; i < ingredients.length; i++){
      if(ingredients[i].status == "Discarded"){
        result.push(ingredients[i]);
      }
    }
    return result;
  }

  async listUnverifiedIngredients() {
    let ingredients = await this._loadAllIngredients();
    let result = [];
    for(let i = 0; i < ingredients.length; i++){
      if(ingredients[i].status == "Unverified"){
        result.push(ingredients[i]);
      }
    }
    return result;
  }

  async verifyIngredient(id, verificationState) {
    let ingredients = await this._loadAllIngredients();
    let ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) {
      throw new Error(`Ingredient with given id "${id} does not exist."`)
    }
    if (verificationState) {
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].id === id) {
          ingredients[i].status = "Verified";
          await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
          return ingredients[i];
        }
      }

    } else {
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].id == id) {
          ingredients[i].status = "Discarded";
          await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
          return "Ingredient successfully discarded."
        }
      }
    }
  }

  async _loadAllIngredients() {
    let ingredients;
    try {
      ingredients = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        ingredients = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " +
          this._getStorageLocation());
      }
    }
    return ingredients;
  }

  _getStorageLocation() {
    return this.ingredientStoragePath;
  }

}

module.exports = IngredientDao;