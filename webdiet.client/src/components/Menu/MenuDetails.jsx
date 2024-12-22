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
                console.log('Fetched menu:', data);
                setMenu(data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);

    const mapToMenuDto = (menu, updatedDish, originalDishId) => {
        console.log('SavedDish received:', updatedDish); // Debug log

        // SprawdŸ czy updatedDish jest liczb¹ (ID) czy obiektem
        const updatedDishId = typeof updatedDish === 'number' ? updatedDish : updatedDish?.id;

        if (!updatedDishId) {
            console.error('Invalid updatedDish:', updatedDish);
            throw new Error('Updated dish must have an ID');
        }

        const menuDto = {
            id: menu.id,
            description: menu.description,
            menuAllergens: menu.menuAllergens.map(allergen => ({
                allergenId: allergen.allergenId,
                name: allergen.name
            })),
            kcal: menu.kcal,
            protein: menu.protein,
            carbo: menu.carbo,
            fat: menu.fat,
            date: menu.date,
            dishes: menu.dishes.map(d => {
                if (d.dish.id === originalDishId) {
                    return {
                        dishId: updatedDishId, // U¿ywamy ID nowego dania
                        type: d.type || 'Dinner', // Zachowujemy oryginalny typ lub ustawiamy domyœlny
                        dish: typeof updatedDish === 'number' ? {
                            // Jeœli mamy tylko ID, tworzymy minimalny obiekt
                            id: updatedDishId,
                            name: d.dish.name || '',
                            description: '',
                            ingredients: [],
                            allergens: [],
                            kcal: 0,
                            protein: 0,
                            carbo: 0,
                            fat: 0
                        } : {
                            // Jeœli mamy pe³ny obiekt, u¿ywamy go
                            ...updatedDish,
                            id: updatedDishId // Upewniamy siê, ¿e ID jest ustawione
                        }
                    };
                }

                // Dla pozosta³ych dañ zachowujemy oryginaln¹ strukturê
                return {
                    dishId: d.dish.id,
                    type: d.type || 'Dinner',
                    dish: d.dish
                };
            })
        };

        console.log('Final mapped menuDto:', menuDto);
        return menuDto;
    };




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
                        onClose={() => navigate('/menus')}
                        onSave={async (savedDish) => {
                            console.log('Received savedDish in onSave:', savedDish);

                            if (!savedDish) {
                                console.error('No savedDish received');
                                return;
                            }

                            try {
                                const updatedMenuData = mapToMenuDto(menu, savedDish, meal.dish.id);
                                const token = localStorage.getItem("jwtToken");

                                console.log('Sending to API:', updatedMenuData);

                                const menuResponse = await fetch(`/api/menu/${id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        "Authorization": `Bearer ${token}`
                                    },
                                    body: JSON.stringify(updatedMenuData)
                                });

                                if (!menuResponse.ok) {
                                    const errorText = await menuResponse.text();
                                    console.error('Server Response Error:', {
                                        status: menuResponse.status,
                                        text: errorText
                                    });
                                    throw new Error(`Failed to update menu: ${menuResponse.status} - ${errorText}`);
                                }

                                const updatedMenu = await menuResponse.json();
                                setMenu(updatedMenu);
                                navigate('/menus');
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
