import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MealDetails from '../Meal/MealDetails';
import { useNavigate } from 'react-router-dom';

export default function MenuDetails() {
    const { id } = useParams();
    const [menu, setMenu] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(`/api/menu/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setMenu(data);
                console.log('Fetched menu:', data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);

  



    if (!menu) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{menu.date}</h1>``
            <p>{menu.description}</p>
            <p>Calories: {menu.kcal}</p>
            <p>Protein: {menu.protein}</p>
            <p>Carbohydrates: {menu.carbo}</p>
            <p>Fat: {menu.fat}</p>
            <h2>Meals</h2>
            <ul>
                {menu.dishes.map((meal) => (
                    <MealDetails
                        key={meal.dish.id}
                        mealId={meal.dish.id}
                        isCustomDish={true}
                        onClose={() => navigate(`/menu/${menu.id}`)}
                        onSave={async (savedDish) => {
                     
                            const updatedMenuData = {
                                ...menu,
                                dishes: menu.dishes.map(d =>
                                    d.dish.id === meal.dish.id
                                        ? { ...d, dish: savedDish }
                                        : d
                                )

                            };
                            console.log("updatedmenudata", updatedMenuData);
           
                            try {
                                const token = localStorage.getItem("jwtToken");
                                const menuResponse = await fetch(`/api/menu/${id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        "Authorization": `Bearer ${token}`
                                    },
                                    body: JSON.stringify(updatedMenuData)
                                });

                                if (!menuResponse.ok) {
                                    throw new Error(`Failed to update menu: ${menuResponse.status}`);
                                }
                                const updatedMenu = await menuResponse.json();
                                setMenu(updatedMenu);
                                navigate(`/menu/${menu.id}`);
                                console.log("updatedmenu,", updatedMenu);
                            } catch (error) {
                                console.error('Error updating menu:', error);
                            }
                        }}
                    />
                ))}
            </ul>
            <h2>Allergens:</h2>
            <ul>
                {menu.menuAllergens.map((allergen) => (
                    <li key={allergen.allergenId}>
                        {allergen.name }
                    </li>
                ))}
            </ul>
        </div>
    );
}
