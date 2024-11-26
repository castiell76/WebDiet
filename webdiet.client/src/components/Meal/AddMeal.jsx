import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

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

export default function AddMeal() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        ingredients: [], // Tablica sk³adników
    });

    const [ingredients, setIngredients] = useState([]); 

    // Pobieranie sk³adników z API
    useEffect(() => {
        fetch("/api/ingredient")
            .then((response) => response.json())
            .then((data) => {
                setIngredients(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    // Dodawanie sk³adnika
    const addIngredient = (ingredient) => {
        setFormData((prevData) => ({
            ...prevData,
            ingredients: [...prevData.ingredients, { ...ingredient, amount: 0 }],
        }));
    };

    // Usuwanie sk³adnika
    const removeIngredient = (id) => {
        setFormData((prevData) => ({
            ...prevData,
            ingredients: prevData.ingredients.filter((ingredient) => ingredient.id !== id),
        }));
    };

    // Obs³uga zmiany iloœci sk³adnika
    const updateIngredientAmount = (id, amount) => {
        setFormData((prevData) => ({
            ...prevData,
            ingredients: prevData.ingredients.map((ingredient) =>
                ingredient.id === id ? { ...ingredient, amount } : ingredient
            ),
        }));
    };

    // Obs³uga przesy³ania danych
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/dish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log("FormData:", formData);
            if (response.ok) {
                alert("Meal has been added!");
                setFormData({
                    name: "",
                    description: "",
                    ingredients: [],
                });
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Error occurred.");
            }
        } catch (error) {
            console.error("Error occurred:", error.response,   error);
            alert("Error connecting with server.");
        }
    };

    return (
        <Container>
            <h1>Add Meal</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="addMeal.name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Meal name"
                        value={formData.name}
                        name="name"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Meal description"
                        value={formData.description}
                        name="description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="mealIngredients">
                    <Form.Label>Ingredients</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            Select Ingredients
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={CustomMenu}>
                            {ingredients.map((ingredient) => (
                                <Dropdown.Item
                                    key={ingredient.id}
                                    onClick={() => addIngredient(ingredient)}
                                >
                                    {ingredient.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <div>
                    <h5>Selected Ingredients</h5>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{ingredient.name}</span>
                            <input
                                type="number"
                                value={ingredient.amount}
                                onChange={(e) =>
                                    updateIngredientAmount(ingredient.id, parseFloat(e.target.value) || 0)
                                }
                            />
                            <button type="button" onClick={() => removeIngredient(ingredient.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <Button type="submit" variant="primary" className="mt-3">
                    Add Meal
                </Button>
            </Form>
        </Container>
    );
}
