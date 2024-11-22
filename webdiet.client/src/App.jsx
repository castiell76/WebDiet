import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IngredientList from './components/Ingredient/IngredientList';
import AddIngredient from "./components/Ingredient/AddIngredient";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {



    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/ingredients" element={<IngredientList />} />
                <Route path="/ingredients/add" element={<AddIngredient />} />
            </Routes>
        </Router>
    );
}

export default App;

