import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MealDetails() {
    const { id } = useParams();
    const [meal, setMeal] = useState(null);


    useEffect(() => {
        fetch(`/api/dish/${id}`)

            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched meal:', data);
                setMeal(data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);


    if (!meal) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{meal.name}</h1>
            <p>{meal.description}</p>
            <p>Calories: {meal.kcal}</p>
            <p>Protein: {meal.protein}</p>
            <p>Carbohydrates: {meal.carbo}</p>
            <p>Fat: {meal.fat}</p>
            <h2>Ingredients</h2>
            <ul>
                {meal.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        {ingredient.name} - {ingredient.quantity || "N/A"}g
                    </li>
                ))}
            </ul>
            <h2>Allergens:</h2>
            <ul>
                {meal.allergens.map((allergen) => (
                    <li key={allergen.id}>
                        {allergen}
                    </li>
                ))}
            </ul>
        </div>
    );
}
