import React, { useState } from 'react';
import { Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';

function MealCard({ mealType, description, imagePath, meals, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);

    // Funkcje otwierania/zamykania modala
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Dodanie wybranego posi³ku
    const addMeal = (meal) => {
        console.log("Meal object before adding:", meal); // SprawdŸ strukturê meal
        setSelectedMeal(meal);
        onMealSelect(meal); // Callback do rodzica
        setShowModal(false);
    };

    // Filtracja posi³ków na podstawie wprowadzonego tekstu
    const filteredMeals = meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <>
            <Card style={{ width: '25rem' }}>
                <Card.Img variant="top" src={imagePath} alt={`${mealType} image`} />
                <Card.Body>
                    <Card.Title>{mealType}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                    {selectedMeal && (
                        <Card.Text className="mt-3">
                            Assigned Meal: {selectedMeal.name}
                        </Card.Text>
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
                        <Form.Control
                            type="text"
                            placeholder="Search for a meal..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </Form.Group>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Meal
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filteredMeals.map((meal) => (
                                <Dropdown.Item
                                    key={meal.id}
                                    onClick={() => {
                                        console.log("Passing meal to handleMealSelect:", meal);
                                        addMeal(meal)
                                    }}>
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
