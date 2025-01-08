import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';
import MealDetails from './MealDetails';

function MealCard({ mealType, description, imagePath, meals,selectedMeal, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userCustomDish, setUserCustomDish] = useState(null);
    const [showAssignMealModal, setShowAssignMealModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleAssignMealClick = () => setShowAssignMealModal(true);
    const handleDetailsClick = () => setShowDetailsModal(true);
    const handleCloseAssignMeal = () => setShowAssignMealModal(false);
    const handleCloseDetails = () => setShowDetailsModal(false);

    const handleClose = () => setShowModal(false);
    const handleCloseDetail = () => setShowModalDetail(false);


    const handleMealSelect = (meal) => {
        onMealSelect(meal);
        setShowAssignMealModal(false);
    };

    useEffect(() => {
    }, [selectedMeal]);

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
                            <Card.Text>
                                Assigned Meal: <strong>{selectedMeal.name}</strong>
                            </Card.Text>
                            <Button variant="secondary" onClick={handleDetailsClick}>
                                Details
                            </Button>
                        </>
                    )}
                    <Button variant="primary" onClick={handleAssignMealClick}>
                        Assign Meal
                    </Button>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign a Meal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
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

            </Modal>
            {/* Modal Assign Meal */}
            <Modal show={showAssignMealModal} onHide={handleCloseAssignMeal}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign a Meal</Modal.Title>
                </Modal.Header>
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAssignMeal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Show Details */}
            <Modal show={showDetailsModal} onHide={handleCloseDetails}>
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MealCard;