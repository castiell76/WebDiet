import React, { useState, useEffect } from "react";
import './App.css';
import Navbar from './components/Navbar';
import Ingredients from './components/Ingredient/IngredientList';
import AddIngredient from "./components/Ingredient/AddIngredient";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        // Pobranie danych z API
        fetch('/api/ingredient', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched ingredient data:", data);
                setIngredients(data); // Ustawienie stanu jako tablicy sk³adników
            })
            .catch(error => console.error("Error fetching ingredient:", error));
    }, []);

    return (
        <div className="App">
            <Navbar />
        </div>
    );
}

export default App;

