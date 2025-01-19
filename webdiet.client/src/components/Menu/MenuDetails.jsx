import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MealDetails from '../Meal/MealDetails';

export default function MenuDetails() {
    const { id } = useParams();
    const [menu, setMenu] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`/api/menu/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("menudetailsres:", data);
                setMenu(data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    const handleMealUpdate = async (savedDish, originalMeal) => {
        try {
            const updatedMenuData = {
                ...menu,
                dishes: menu.dishes.map(d =>
                    d.dish.id === originalMeal.dish.id
                        ? {
                            ...d,
                            dish: savedDish,
                            userCustomDishId: savedDish.userCustomDishId
                        }
                        : d
                )
            };

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
        } catch (error) {
            console.error('Error updating menu:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">No menu found</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{formatDate(menu.date)}</h1>
            {menu.description && (
                <p className="text-gray-600 mb-6">{menu.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded">
                    <p className="font-semibold">Calories: {menu.kcal?.toFixed(1) || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                    <p className="font-semibold">Protein: {menu.protein?.toFixed(1) || 0}g</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                    <p className="font-semibold">Carbohydrates: {menu.carbo?.toFixed(1) || 0}g</p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                    <p className="font-semibold">Fat: {menu.fat?.toFixed(1) || 0}g</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Meals</h2>
            <div className="space-y-4">
                {menu.dishes.map((meal) => (
                    <MealDetails
                        key={`${meal.dish.id}-${meal.userCustomDishId || 'default'}`}
                        mealId={meal.dish.id}
                        customDishId={meal.userCustomDishId }
                        isCustomDish={Boolean(meal.userCustomDishId)}
                        onClose={() => navigate(`/menu/${menu.id}`)}
                        onSave={(savedDish) => handleMealUpdate(savedDish, meal)}
                    />
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Allergens</h2>
            <ul className="list-disc list-inside space-y-2">
                {menu.menuAllergens.map((allergen) => (
                    <li key={allergen.allergenId} className="text-gray-700">
                        {allergen.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}