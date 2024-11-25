import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

export default function AddIngredient() {
    // Obs³uga formularza
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        kcal: '',
        protein: '',
        carbo: '',
        fat: '',
    });

    // Obs³uga zmian w polach formularza
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Obs³uga przesy³ania danych
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
                <Button variant="primary" type="submit">
                    Dodaj sk³adnik
                </Button>
            </Form>
        </Container>
    );
}
    