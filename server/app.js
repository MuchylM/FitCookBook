"use strict";
const path = require("path");
const express = require("express");  //načtení modulu express
const cookieParser = require("cookie-parser");

const ingredientRouter = require("./controller/ingredient-controller");
const recipeRouter = require("./controller/recipe-controller");
const ingredientImageRouter = require("./controller/ingredient-image-controller");
const recipeImageRouter = require("./controller/recipe-image-controller");

//inicializace nového Express.js serveru
const app = express();

//definování portu, na kterém má aplikace běžet na localhostu
const port = 4269;

app.use(cookieParser());
// konfigurace cesty, kde se nachází statické soubory klientské části, které mají být dostupné
app.use(express.static(path.join(__dirname, 'build')));

// vytvoření routy, kde bude klientská část dostupná
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use("/ingredient", ingredientRouter);

app.use("/recipe", recipeRouter);

app.use("/ingredientImage", ingredientImageRouter);

app.use("/recipeImage", recipeImageRouter);

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});