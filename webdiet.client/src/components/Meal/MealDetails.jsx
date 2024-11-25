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
            <p><strong>Description:</strong> {meal.description}</p>
            <p><strong>Kcal:</strong> {meal.kcal}</p>
            <p><strong>Protein:</strong> {meal.protein}</p>
            <p><strong>Carbo:</strong> {meal.carbo}</p>
            <p><strong>Fat:</strong> {meal.fat}</p>
        </div>
    );
}
