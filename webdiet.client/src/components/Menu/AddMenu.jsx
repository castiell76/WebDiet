import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        meals: [], 
    });

    const [meals, setMeals] = useState([]);


    useEffect(() => {
        fetch("/api/dish")
            .then((response) => response.json())
            .then((data) => {
                setMeals(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


    const addMeal = (meal) => {
        setFormData((prevData) => ({
            ...prevData,
            meals: [...prevData.meals, { ...meal, type: meal.type || "" }],
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

            console.log("token ", token);


            if (response.ok) {
                showToast({ message: "Menu has been added!", variant: 'success' });

                setFormData({
                    description: "",
                    date: new Date(),
                    kcal: "",
                    dishes: [], 
                });
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
                        placeholder="Menu description"
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
                <Form.Group className="mb-3" controlId="addMenu.Meals">
                    <Form.Label>Meals</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            Select Meals
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={CustomMenu}>
                            {meals.map((meal) => (
                                <Dropdown.Item
                                    key={meal.id}
                                    onClick={() => addMeal(meal)}
                                >
                                    {meal.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <div>
                    <h5>Selected Meals</h5>
                    {formData.meals.map((meal, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{meal.name}</span>
                            <input
                                type="text"
                                value={meal.type}
                                onChange={(e) =>
                                    updateMealType(meal.id, e.target.value || 0)
                                }
                            />
                            <button type="button" onClick={() => removeMeal(meal.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <Button type="submit" variant="primary" className="mt-3">
                    Add Menu
                </Button>
            </Form>
        </Container>
    );
}
