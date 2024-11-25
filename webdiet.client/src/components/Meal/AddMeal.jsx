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
        kcal: "",
        protein: "",
        carbo: "",
        fat: "",
    });

    const [ingredients, setIngredients] = useState([]); // Lista sk³adników z API
    const [selectedIngredients, setSelectedIngredients] = useState([]); // Wybrane sk³adniki

    // Pobieranie sk³adników z API
    useEffect(() => {
        fetch("/api/ingredient")
            .then((response) => response.json())
            .then((data) => {
                setIngredients(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    // Dodawanie/aktualizacja sk³adnika
    const handleSelect = (ingredientId) => {
        const ingredient = ingredients.find((i) => i.id === ingredientId);

        setSelectedIngredients((prev) => {
            const existing = prev.find((item) => item.id === ingredientId);
            if (existing) {
                return prev; // Nie dodawaj ponownie
            }
            console.log("Dodawanie sk³adnika:", ingredient);
            return [...prev, { ...ingredient, amount: 1 }]; // Dodaj z domyœln¹ iloœci¹
        });
    };

    // Aktualizacja iloœci sk³adnika
    const handleAmountChange = (id, amount) => {
        setSelectedIngredients((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, amount: amount > 0 ? amount : 1 } : item
            )
        );
    };

    // Usuwanie sk³adnika
    const handleRemove = (id) => {
        setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
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
                body: JSON.stringify({ ...formData, selectedIngredients }),
            });

            if (response.ok) {
                alert("Meal has been added!");
                setFormData({
                    name: "",
                    description: "",
                    kcal: "",
                    protein: "",
                    carbo: "",
                    fat: "",
                });
                setSelectedIngredients([]);
            } else {
                alert("Error occurred.");
            }
        } catch (error) {
            console.error("Error occurred:", error);
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
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
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
                                    eventKey={ingredient.id.toString()}
                                    onClick={() => handleSelect(ingredient.id)}
                                >
                                    {ingredient.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <h5>Selected Ingredients</h5>
                {selectedIngredients.map((ingredient) => (
                    <Form.Group
                        key={ingredient.id}
                        className="mb-3 d-flex align-items-center"
                    >
                        <Form.Label className="me-3">{ingredient.name}</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={ingredient.amount}
                            onChange={(e) =>
                                handleAmountChange(ingredient.id, parseInt(e.target.value, 10))
                            }
                            className="me-3"
                            style={{ width: "100px" }}
                        />
                        <Button
                            variant="danger"
                            onClick={() => handleRemove(ingredient.id)}
                        >
                            X
                        </Button>
                    </Form.Group>
                ))}

                <Button type="submit" variant="primary">
                    Add Meal
                </Button>
            </Form>
        </Container>
    );
}



