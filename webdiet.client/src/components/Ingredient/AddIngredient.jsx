import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';


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
export default function AddIngredient() {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        kcal: '',
        protein: '',
        carbo: '',
        fat: '',
        allergens:[],
    });
    const payload = {
        ...formData,
        allergens: formData.allergens.map(a => a.id),
    };
    const [allergens, setAllergens] = useState([]);


    useEffect(() => {
        fetch("/api/ingredients/Allergen")
            .then((response) => response.json())
            .then((data) => {
                setAllergens(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const addAllergen = (allergen) => {
        setFormData((prevData) => ({
            ...prevData,
            allergens: [...prevData.allergens, { ...allergen }],
        }));
    };


    const removeAllergen = (id) => {
        setFormData((prevData) => ({
            ...prevData,
            allergens: prevData.allergens.filter((allergen) => allergen.id !== id),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Sk³adnik zosta³ dodany!');
                console.log("Fetched allergens:", allergens);
                console.log("FormData allergens:", formData.allergens);
                setFormData({
                    name: '',
                    description: '',
                    kcal: '',
                    protein: '',
                    carbo: '',
                    fat: '',
                });
            } else {
                alert('Wyst¹pi³ b³¹d podczas dodawania sk³adnika.');
            }
        } catch (error) {
            console.error('B³¹d:', error);
            alert('Wyst¹pi³ b³¹d podczas komunikacji z serwerem.');
        }
    };

    return (
        <Container>
            <h1>Add Ingredient</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="addIngredient.name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingredient name"
                        value={formData.name}
                        name="name"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingredient description"
                        value={formData.description}
                        name="description"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.kcal">
                    <Form.Label>Kcal</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="KCal"
                        value={formData.kcal}
                        name="kcal"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.protein">
                    <Form.Label>Protein</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Protein [g]"
                        value={formData.protein}
                        name="protein"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.carbo">
                    <Form.Label>Carbo</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Carbo [g]"
                        value={formData.carbo}
                        name="carbo"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.fat">
                    <Form.Label>Fat</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Fat [g]"
                        value={formData.fat}
                        name="fat"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIngredient.allergens">
                    <Form.Label>Details</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            Select Details
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={CustomMenu}>
                            {allergens.map((allergen) => (
                                <Dropdown.Item
                                    key={allergen.id}
                                    onClick={() => addAllergen(allergen)}
                                >
                                    {allergen.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <div>
                    <h5>Details</h5>
                    {formData.allergens.map((allergen, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{allergen.name}</span>
                            <button type="button" onClick={() => removeAllergen(allergen.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <Button variant="primary" type="submit">
                    Dodaj sk³adnik
                </Button>
            </Form>
        </Container>
    );
}
    