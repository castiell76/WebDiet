import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Select from "react-select";

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

export default function AddMeal({ showToast}) {
    const [formData, setFormData] = useState({
        name: "",
        types:[],
        description: "",
        ingredients: [], 
    });
    const [selectedTypes, setSelectedTypes] = useState([]);
    const mealTypes = [
        'Breakfast',
        'Lunch', 
        'Dinner',
        'Supper',
        'Snack', 
    ]

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
            ingredients: [...prevData.ingredients, { ...ingredient, quantity: 0 }],
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
    const updateIngredientQuantity = (id, quantity) => {
        setFormData((prevData) => ({
            ...prevData,
            ingredients: prevData.ingredients.map((ingredient) =>
                ingredient.id === id ? { ...ingredient, quantity } : ingredient
            ),
        }));
    };

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = async (inputValue) => {
        if (!inputValue) return;

        setIsLoading(true);
        try {

            const ingredients = await fetchIngredients(inputValue);
            const formattedOptions = ingredients.map((ingredient) => ({
                value: ingredient.id,
                label: ingredient.name,
            }));
            setOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (selectedOption) => {

        const ingredient = {
            id: selectedOption.value,
            name: selectedOption.label,
        };
        addIngredient(ingredient);
    };
    const handleSelectTypes = (option) => {
        setSelectedTypes((prevSelectedTypes) => {
            const isAlreadySelected = prevSelectedTypes.includes(option);
            const updatedTypes = isAlreadySelected
                ? prevSelectedTypes.filter((type) => type !== option) 
                : [...prevSelectedTypes, option]; 


            setFormData((prevFormData) => ({
                ...prevFormData,
                types: updatedTypes,
            }));

            return updatedTypes;
        });
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
                showToast({ message: "Meal has been added!", variant: 'success' });

                setFormData({
                    name: "",
                    description: "",
                    type:"",
                    ingredients: [],
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
                <Form.Group className="mb-3" controlId="addMeal.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Meal description"
                        value={formData.description}
                        name="description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMeal.type">
                    <Form.Label>Type</Form.Label>
                    <DropdownButton title="Types" variant="primary">
                        {mealTypes.map((type, index) => (
                            <Dropdown.Item key={index} as="div" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                    type="checkbox"
                                    id={`checkbox-${index}`} 
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleSelectTypes(type)}
                                    label={type} 
                                />
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Form.Control
                        type="text"
                        placeholder="Meal type"
                        value={formData.type}
                        name="type"
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    updateIngredientQuantity(ingredient.id, parseFloat(e.target.value) || 0)
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
