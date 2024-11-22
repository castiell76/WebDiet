import React, { useState, useEffect } from "react";


export default function IngredientList({}) {

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


    if (!ingredients || ingredients.length === 0) {
        return <p>Wczytywanie...</p>;
    }

    return (

        <div>
            <h1>Lista sk³adników:</h1>
            {ingredients.map((ingredient, index) => (
                <div className="ingredient-card" key={index}>
                    <h2>{ingredient.name}</h2>a
                    <p><strong>Kcal:</strong> {ingredient.kcal}</p>
                    <p><strong>Protein:</strong> {ingredient.protein}</p>
                    <p><strong>Carbo:</strong> {ingredient.carbo}</p>
                    <p><strong>Fat:</strong> {ingredient.fat}</p>
                </div>
            ))}
        </div>
    );
}