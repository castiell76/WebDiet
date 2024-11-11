import React, { useState, useEffect } from "react";
import './App.css';
import Navbar from './components/Navbar';
import Ingredient from './components/Ingredient';
function App() {
    // Inicjalizacja stanu sk³adnika
    const [ingredient, setIngredient] = useState(null);

    useEffect(() => {

        // Pobranie tokena z localStorage
        const token = localStorage.getItem('token');

        // ¯¹danie do API z do³¹czeniem tokena
        fetch('/api/ingredient/2', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched ingredient data:", data); // Logowanie danych do konsoli
                setIngredient(data); // Ustawienie stanu
            })
            .catch(error => console.error("Error fetching ingredient:", error));
    }, []);

    return (
        <div className="App">
            <Navbar />
            {/* Przekazanie danych sk³adnika jako prop do komponentu Ingredient */}
            <Ingredient ingredient={ingredient} />
        </div>
    );
}

export default App;