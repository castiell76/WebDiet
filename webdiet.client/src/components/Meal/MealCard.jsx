import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';


function MealCard({ mealType, description, imagePath }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    // Funkcja do otwierania/ zamykania modala
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Funkcja do dodawania posi³ku do karty
    const addMeal = (meal) => {
        setSelectedMeal(meal);
        setShowModal(false); // Zamknij modal po przypisaniu posi³ku
    };
    const [meals, setMeals] = useState([]);


    useEffect(() => {
        fetch("/api/dish")
            .then((response) => response.json())
            .then((data) => {
                setMeals(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <>
            <Card style={{ width: '25rem' }}>
                <Card.Img variant="top" src={imagePath} />
                <Card.Body>
                    <Card.Title>{mealType}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                    {selectedMeal && (
                        <>
                            <Card.Text className="mt-3">Assigned Meal: {selectedMeal.name}</Card.Text>
                        </>
                    )}
                    <Button variant="primary" onClick={handleShow}>
                        Assign Meal
                    </Button>
                </Card.Body>
            </Card>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign a Meal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="mealSearch">
                        <Form.Label>Search Meals</Form.Label>
                        <Form.Control type="text" placeholder="Search for a meal..." />
                    </Form.Group>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Meal
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MealCard;