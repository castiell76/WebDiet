import React, { useState } from 'react';
import { Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';
import MealDetails from './MealDetails';

function MealCard({ mealType, description, imagePath, meals, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [userCustomDish, setUserCustomDish] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleCloseDetail = () => setShowModalDetail(false);

    const handleMealSelect = (meal) => {
        setSelectedMeal(meal);
        onMealSelect(meal);
        setShowModal(false);
    };

    const handleSaveCustomDish = (customDishData) => {
        setUserCustomDish({
            id: customDishData.id,
            baseDishId: selectedMeal.id
        });
    };

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
                        <>
                            <Card.Text className="mt-3">
                                Assigned Meal: <strong>{selectedMeal.name}</strong>
                                {userCustomDish && <span className="text-success"> (Customized)</span>}
                            </Card.Text>
                            <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={() => setShowModalDetail(true)}
                            >
                                Show Details
                            </Button>
                        </>
                    )}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Assign Meal
                    </Button>
                </Card.Body>
            </Card>

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
                                    onClick={() => handleMealSelect(meal)}
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

            <Modal show={showModalDetail} onHide={handleCloseDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Meal Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MealDetails
                        mealId={selectedMeal?.id}
                        isCustomDish={!!userCustomDish}
                        customDishId={userCustomDish?.id} 
                        onClose={handleCloseDetail}
                        onSave={handleSaveCustomDish}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MealCard;