"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const IngredientDao = require("../dao/ingredient-dao");
const ingredientDao = new IngredientDao(path.join(__dirname, "..", "storage", "ingredients.json"));

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "recipes.json");
const UNVERIFIED_STORAGE_PATH = path.join(__dirname, "..", "storage", "unverifiedRecipes.json");
const DISCARDED_STORAGE_PATH = path.join(__dirname, "..", "storage", "discardedRecipes.json");

class RecipeDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    this.unverifiedStoragePath = UNVERIFIED_STORAGE_PATH;
    this.discardedStoragePath = DISCARDED_STORAGE_PATH;
  }

  async createRecipe(recipe) {
    let isRecipeHealthy = false;
    let recipes = await this._loadAllRecipes();
    let ingredients = await ingredientDao.listIngredients();
    let unverifiedIngredients = await ingredientDao.listUnverifiedIngredients();

    //Checking if recipe with given name already exists
    if (recipes.length > 0) {
      if (recipes.find(r => r.name === recipe.name)) {
        throw new Error(`Recipe with given name ${recipe.name} already exists.`);
      }
    }

    //Checking if recipe contains a healthy ingredient
    for(let i = 0; i < recipe.ingredientsList.length; i++){
      if(recipe.ingredientsList[i].healthyIngredient == true){
        isRecipeHealthy = true;
        break;
      }
    }
    if(!isRecipeHealthy){
      throw new Error(`Recipe does not contain any healthy ingredients. Recipes must consist of at least ONE healthy ingredient.`);
    }

    //If recipe contains ingredients that do not yet exist, create new ingredient 
    for (let i = 0; i < recipe.ingredientsList.length; i++) {
      if (!(ingredients.find(ing => ing.name == recipe.ingredientsList[i].name))) {
        if (!(unverifiedIngredients.find(ing => ing.name == recipe.ingredientsList[i].name))){
          let newIngredient = { ...recipe.ingredientsList[i] };
          delete newIngredient.amount;
          await ingredientDao.createIngredient(newIngredient);
        }
      }
    }
    recipe.id = crypto.randomBytes(6).toString("hex");
    recipe.status = "Unverified";
    recipes.push(recipe);
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
    return recipe;
  }

  async getRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const result = recipes.find(i => i.id === id);
    if (result.status === "Unverified") {
      throw new Error(`Recipe with given id "${id}" is not verified.`);
    }
    if (result.status === "Discarded") {
      throw new Error(`Recipe with given id "${id}" has been discarded.`);
    }
    return result;
  }

  async updateRecipe(recipe) {
    let recipes = await this._loadAllRecipes();
    const recipeIndex = recipes.findIndex(i => i.id === recipe.id)
    if (recipeIndex < 0) {
      throw new Error(`Recipe with given id ${recipe.id} does not exists.`);
    } else {
      recipes[recipeIndex] = {
        ...recipes[recipeIndex],
        ...recipe
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return recipes[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const recipeIndex = recipes.findIndex(i => i.id === id)
    if (recipeIndex >= 0) {
      recipes.splice(recipeIndex, 1)
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return {};
  }

  async listRecipes() {
    let recipes = await this._loadAllRecipes();
    let result = [];
    for(let i = 0; i < recipes.length; i++){
      if(recipes[i].status == "Verified"){
        result.push(recipes[i]);
      }
    }
    return result;
  }

  async listUnverifiedRecipes() {
    let recipes = await this._loadAllRecipes();
    let result = [];
    for(let i = 0; i < recipes.length; i++){
      if(recipes[i].status == "Unverified"){
        result.push(recipes[i]);
      }
    }
    return result;
  }

  async listDiscardedRecipes() {
    let recipes = await this._loadAllRecipes();
    let result = [];
    for(let i = 0; i < recipes.length; i++){
      if(recipes[i].status == "Discarded"){
        result.push(recipes[i]);
      }
    }
    return result;
  }

  async listHealthyRecipes(ingredientId) {
    let ingredientNotFound = true;
    let ingredientName;
    let recipes = await this._loadAllRecipes();
    let healthyRecipes = [];
    let ingredients = await ingredientDao.listIngredients();
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].id == ingredientId) {
        ingredientNotFound = false;
        ingredientName = ingredients[i].name;
        break;
      }
    }
    if (ingredientNotFound) {
      throw new Error(`Ingredient with id ${ingredientId} not found`);
    }
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].ingredientsList.length; j++) {
        if (recipes[i].ingredientsList[j].name == ingredientName) {
          healthyRecipes.push(recipes[i]);
        }
      }
    }
    return healthyRecipes;
  }

  async verifyRecipe(recipeId, verificationStatus) {
    let recipes = await this._loadAllRecipes();
    
    let unverifiedIngredients = await ingredientDao.listUnverifiedIngredients();
    let recipe = recipes.find(r => r.id == recipeId);
    if (!recipe) {
      throw new Error(`Recipe with given id "${recipeId}" does not exist.`);
    }
    if (verificationStatus) {
      for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == recipeId) {
          recipes[i].status = "Verified";
          for (let i = 0; i < recipe.ingredientsList.length; i++) {
            for (let j = 0; j < unverifiedIngredients.length; j++) {
              if (recipe.ingredientsList[i].name == unverifiedIngredients[j].name) {
                await ingredientDao.verifyIngredient(unverifiedIngredients[j].id, true);
              }
            }
          }
          await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
          return recipe;
        }
      }
    } else {
      for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == recipeId) {
          recipes[i].status = "Discarded";
          for (let i = 0; i < recipe.ingredientsList.length; i++) {
            for (let j = 0; j < unverifiedIngredients.length; j++) {
              if (recipe.ingredientsList[i].name == unverifiedIngredients[j].name) {
               ingredientDao.verifyIngredient(unverifiedIngredients[j].id, false);
              }
            }
          }
          await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
          return "Recipe successfully discarded.";
        }
      } 
    }
  }

  async _loadAllRecipes() {
    let recipes;
    try {
      recipes = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        recipes = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " +
          this._getStorageLocation());
      }
    }
    return recipes;
  }

  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = RecipeDao;