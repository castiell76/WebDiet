import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MealCard from "../Meal/MealCard"

// Custom Toggle
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children} &#x25bc;
    </Button>
));
CustomToggle.displayName = 'CustomToggle';


// Custom Menu
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled px-2">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().includes(value.toLowerCase())
                    )}
                </ul>
            </div>
        );
    }
);
CustomMenu.displayName = 'CustomMenu';

export default function AddMenu({ showToast }) {
    const [formData, setFormData] = useState({
        description: "",
        date: new Date(),
        kcal:"",
        dishes: [], 
    });


    const mealImages = {
        Breakfast: "/assets/breakfast.jpg",
        Lunch: "/assets/lunch.jpg",
        Dinner: "/assets/dinner.jpg",
        Tea: "/assets/tea.jpg",
        Supper: "/assets/supper.jpg"
    };
    const [meals, setMeals] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState({});


    useEffect(() => {
        fetch("/api/dish")
            .then((response) => response.json())
            .then((data) => {
                setMeals(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


    const addMeal = (meal) => {
        if (typeof meal !== "object" || !meal.id || !meal.name) {
            console.error("Invalid meal object:", meal);
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            dishes: [...prevData.dishes, { ...meal, type: meal.type || "" }],
        }));
    };


    const removeMeal = (id) => {
        setFormData((prevData) => ({
            ...prevData,
            meals: prevData.meals.filter((meal) => meal.id !== id),
        }));
    };


    const updateMealType = (id, type) => {
        setFormData((prevData) => ({
            ...prevData,
            meals: prevData.meals.map((meal) =>
                meal.id === id ? { ...meal, type } : meal
            ),
        }));
    };

    const [mealCount, setMealCount] = useState(0);

    // Funkcja do obs³ugi zmiany w formularzu
    const handleSelectChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10); // Parsowanie do liczby
        setMealCount(selectedValue);
    };

    const getMealTypes = (mealCount) => {
        switch (mealCount) {
            case 1:
                return ["Breakfast", "Dinner", "Supper"];
            case 2:
                return ["Breakfast", "Lunch", "Dinner", "Supper"];
            case 3:
                return ["Breakfast", "Lunch", "Dinner", "Tea", "Supper"];
            default:
                return [];
        }
    };


    // Obs³uga przesy³ania danych
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch("/api/menu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });



            if (response.ok) {
                showToast({ message: "Menu has been added!", variant: 'success' });

                setFormData({
                    description: "",
                    date: new Date(),
                    kcal: "",
                    dishes: [], 
                    
                });
                console.log("sprawdzam...",formData)
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                showToast("Error occurred while adding the meal.");

            }
        } catch (error) {
            console.error("Error occurred:", error.response, error);
            showToast("Error connecting with server.");
        }
    };





    const mealTypes = getMealTypes(mealCount);

    return (
        <Container>
            <h1>Add Menu</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="addMenu.date">
                    <Form.Label>Date</Form.Label>
                    <DatePicker
                        selected={formData.date}
                        onChange={(date) => setFormData({ ...formData, date })}
                        dateFormat="yyyy-MM-dd"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMenu.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Menu description - optional"
                        value={formData.description}
                        name="description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMenu.kcal">
                    <Form.Label>Kcal</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Kcal total"
                        value={formData.kcal}
                        name="kcal"
                        onChange={(e) => setFormData({ ...formData, kcal: parseFloat(e.target.value) || 0 })}
                    />
                </Form.Group>
                <Form.Select className="mb-3" aria-label="Meals quantity" onChange={handleSelectChange}>
                    <option>Choose meals quantity</option>
                    <option value="1">Three</option>
                    <option value="2">Four</option>
                    <option value="3">Five</option>
                </Form.Select>
                <div className="meal-cards d-flex justify-content-center align-items-center container py-4">
                    {mealTypes.map((mealType) => (
                        <MealCard
                            key={mealType}
                            mealType={mealType}
                            description={`Description for ${mealType.toLowerCase()}`}
                            imagePath={mealImages[mealType] }
                            meals={meals} // Zbiór dostêpnych posi³ków
                            onMealSelect={(selectedMeal) => {
                                console.log("Meals data in AddMenu:", meals);
                                console.log("Selected meal from MealCard:", selectedMeal);
                                handleMealSelect(selectedMeal);  
                            }}
                        />
                    ))}
                </div>

                <Button type="submit" variant="primary" className="mt-3">
                    Add Menu
                </Button>
            </Form>
        </Container>
    );
}
