import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './core/layout';
import LayoutIngredients from './core/layout_ingredients'
import RecipeList from "./routes/recipe-list";
import IngredientList from "./routes/ingredient-list";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipeList />} />
        </Route>
        <Route path="/ingredients" element={<LayoutIngredients />}>
          <Route index element={<IngredientList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
