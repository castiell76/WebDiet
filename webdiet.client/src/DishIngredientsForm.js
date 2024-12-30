import React, { useState } from 'react';

function DishIngredientsForm({ ingredients, dish }) {
    const [selectedIngredients, setSelectedIngredients] = useState([]);


    const handleSelect = (ingredientId) => {
        if (selectedIngredients.includes(ingredientId)) {
            setSelectedIngredients(selectedIngredients.filter(id => id !== ingredientId));
        } else {
            setSelectedIngredients([...selectedIngredients, ingredientId]);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/dishes/${dish.id}/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredientIds: selectedIngredients }),
        })
            .then(response => {
                if (response.ok) {
                    alert('Sk�adniki zosta�y przypisane do dania.');
                } else {
                    alert('Wyst�pi� b��d przy przypisywaniu sk�adnik�w.');
                }
            })
            .catch(error => console.error('B��d przy wysy�aniu danych:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{dish.name}</h2>
            <div>
                {ingredients.map(ingredient => (
                    <label key={ingredient.id}>
                        <input
                            type="checkbox"
                            value={ingredient.id}
                            checked={selectedIngredients.includes(ingredient.id)}
                            onChange={() => handleSelect(ingredient.id)}
                        />
                        {ingredient.name}
                    </label>
                ))}
            </div>
            <button type="submit">Przypisz sk�adniki</button>
        </form>
    );
}

export default DishIngredientsForm;
