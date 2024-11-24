import React, { useState, useEffect } from "react";
import NavbarBasic from './components/Navbar';
import IngredientList from './components/Ingredient/IngredientList';
import AddIngredient from "./components/Ingredient/AddIngredient";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


    return (
        <Router>
        <NavbarBasic></NavbarBasic>
            <Routes>
                <Route path="/ingredients" element={<IngredientList />} />
                <Route path="/ingredients/add" element={<AddIngredient />} />
            </Routes>
        </Router>
    );
}

export default App;

