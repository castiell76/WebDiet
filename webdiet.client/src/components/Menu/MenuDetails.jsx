import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MenuDetails() {
    const { id } = useParams();
    const [menu, setMenu] = useState(null);


    useEffect(() => {

        fetch(`/api/menu/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched menu:', data);
                setMenu(data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);



    if (!menu) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{menu.date}</h1>
            <p>{menu.description}</p>
            <p>Calories: {menu.kcal}</p>
            <p>Protein: {menu.protein}</p>
            <p>Carbohydrates: {menu.carbo}</p>
            <p>Fat: {menu.fat}</p>
            <h2>Meals</h2>
            <ul>
                {menu.dishes.map((meal) => (
                    <li key={meal.dish.id}>
                        {meal.dish.name} 
                    </li>
                ))}
            </ul>
            <h2>Allergens:</h2>
            {/*<ul>*/}
            {/*    {menu.allergens.map((allergen) => (*/}
            {/*        <li key={allergen.id}>*/}
            {/*            {allergen}*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
}
