import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown } from 'react-bootstrap';
import MealDetails from './MealDetails';

function MealCard({ mealType, description, imagePath, meals, selectedMeal, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userCustomDish, setUserCustomDish] = useState(null);
    const [showAssignMealModal, setShowAssignMealModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleAssignMealClick = () => setShowAssignMealModal(true);

    const handleDetailsClick = () => {
        if (selectedMeal) {
            // Upewnij się, że mamy wszystkie potrzebne dane
            const customDish = {
                id: selectedMeal.id || selectedMeal.baseDishId || 0,
                name: selectedMeal.name,
                description: selectedMeal.description,
                protein: selectedMeal.protein,
                carbo: selectedMeal.carbo,
                fat: selectedMeal.fat,
                kcal: selectedMeal.kcal,
                ingredients: selectedMeal.ingredients || [],
                baseDishId: selectedMeal.baseDishId || selectedMeal.id
            };
            setUserCustomDish(customDish);
            setShowDetailsModal(true);
        }
    };

    const handleCloseAssignMeal = () => setShowAssignMealModal(false);
    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        // Zachowaj stan userCustomDish po zamknięciu modala
    };
    const handleClose = () => setShowModal(false);

    const handleMealSelect = (meal) => {
        const selectedMealWithDetails = {
            ...meal,
            baseDishId: meal.id, // Zachowaj oryginalny ID
        };
        onMealSelect(selectedMealWithDetails);
        setShowAssignMealModal(false);
    };

    useEffect(() => {
        if (selectedMeal) {
            const newCustomDish = {
                id: selectedMeal.id || selectedMeal.baseDishId || 0,
                name: selectedMeal.name,
                description: selectedMeal.description,
                protein: selectedMeal.protein,
                carbo: selectedMeal.carbo,
                fat: selectedMeal.fat,
                kcal: selectedMeal.kcal,
                ingredients: selectedMeal.ingredients || [],
                baseDishId: selectedMeal.baseDishId || selectedMeal.id
            };
            setUserCustomDish(newCustomDish);
        }
    }, [selectedMeal]);

    const handleSaveCustomDish = (customDishData) => {
        const updatedCustomDish = {
            ...customDishData,
            baseDishId: selectedMeal?.baseDishId || selectedMeal?.id || 0,
            isCustom: true,
            id: customDishData.id
        };
        setUserCustomDish(updatedCustomDish);
        onMealSelect(updatedCustomDish);
    };

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
                            <Button
                                variant="secondary"
                                onClick={handleDetailsClick}
                                className="me-2"
                                disabled={!selectedMeal}
                            >
                                Details
                            </Button>
                        </>
                    )}
                    <Button variant="primary" onClick={handleAssignMealClick}>
                        Assign Meal
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Meal Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userCustomDish && (
                        <MealDetails
                            mealId={userCustomDish.baseDishId || userCustomDish.id}
                            isCustomDish={true}
                            customDishId={userCustomDish.id}
                            initialData={userCustomDish}
                            onClose={handleCloseDetails}
                            onSave={handleSaveCustomDish}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Reszta komponentu pozostaje bez zmian */}
        </>
    );
}

export default MealCard;    