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
                    alert('Sk³adniki zosta³y przypisane do dania.');
                } else {
                    alert('Wyst¹pi³ b³¹d przy przypisywaniu sk³adników.');
                }
            })
            .catch(error => console.error('B³¹d przy wysy³aniu danych:', error));
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
            <button type="submit">Przypisz sk³adniki</button>
        </form>
    );
}

export default DishIngredientsForm;
