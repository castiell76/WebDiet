import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function IngredientDetails() {
    const { id } = useParams();
    const [ingredient, setIngredient] = useState(null);

    useEffect(() => {
        fetch(`/api/ingredient/${id}`)

            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched ingredient:', data);
                setIngredient(data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);

    // Warunek sprawdzaj¹cy, czy dane zosta³y za³adowane
    if (!ingredient) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{ingredient.name}</h1>
            <p><strong>Description:</strong> {ingredient.description}</p>
            <p><strong>Kcal:</strong> {ingredient.kcal}</p>
            <p><strong>Protein:</strong> {ingredient.protein}</p>
            <p><strong>Carbo:</strong> {ingredient.carbo}</p>
            <p><strong>Fat:</strong> {ingredient.fat}</p>
            <p><strong>Allergens:</strong></p>
            {ingredient.allergens && ingredient.allergens.length > 0 ? (
                <ul>
                    {ingredient.allergens.map((allergen, index) => (
                        <li key={allergen.id || index}>{allergen.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No allergens</p>
            )}
        </div>
    );
}
