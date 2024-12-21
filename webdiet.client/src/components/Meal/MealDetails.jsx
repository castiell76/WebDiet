import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const MealDetails = ({ mealId, isCustomDish, customDishId, onClose, onSave }) => {
    const [mealDetails, setMealDetails] = useState(null);
    const [localIngredients, setLocalIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [selectedIngredientToReplace, setSelectedIngredientToReplace] = useState(null);
    const [modalMode, setModalMode] = useState('replace');

    useEffect(() => {
        if (mealId) {
            fetchMealDetails();
        }
    }, [mealId, isCustomDish, customDishId]);

    useEffect(() => {
        if (mealDetails) {
            setLocalIngredients(mealDetails.ingredients);
            setHasChanges(false);
        }
    }, [mealDetails]);

    const fetchMealDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            if (isCustomDish && customDishId) {
                response = await fetch(`/api/usercustomdish/${customDishId}`);
            } else {
                response = await fetch(`/api/dish/${mealId}`);
            }

            if (!response.ok) {
                throw new Error('Failed to fetch meal details');
            }

            const data = await response.json();
            setMealDetails(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching meal details:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableIngredients = async () => {
        try {
            const response = await fetch('/api/ingredient');
            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }
            const data = await response.json();
            setAvailableIngredients(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            setError('Failed to load available ingredients');
        }
    };

    const handleQuantityChange = (ingredientId, newQuantity) => {
        setLocalIngredients(prevIngredients =>
            prevIngredients.map(ingredient =>
                ingredient.id === ingredientId
                    ? { ...ingredient, quantity: parseInt(newQuantity) }
                    : ingredient
            )
        );
        setHasChanges(true);
    };

    const handleReplaceIngredient = (ingredientId) => {
        setSelectedIngredientToReplace(ingredientId);
        setModalMode('replace');
        setShowIngredientModal(true);
        fetchAvailableIngredients();
    };

    const handleAddIngredient = () => {
        setModalMode('add');
        setShowIngredientModal(true);
        fetchAvailableIngredients();
    };

    const handleRemoveIngredient = (ingredientId) => {
        setLocalIngredients(prevIngredients =>
            prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
        setHasChanges(true);
    };

    const handleIngredientSelection = (ingredientId) => {
        const selectedIngredient = availableIngredients.find(ing => ing.id === ingredientId);

        if (modalMode === 'add') {
            const newIngredient = {
                ...selectedIngredient,
                quantity: 100
            };
            setLocalIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        } else {
            const oldIngredient = localIngredients.find(ing => ing.id === selectedIngredientToReplace);
            setLocalIngredients(prevIngredients =>
                prevIngredients.map(ingredient =>
                    ingredient.id === selectedIngredientToReplace
                        ? { ...selectedIngredient, quantity: oldIngredient.quantity }
                        : ingredient
                )
            );
        }

        setHasChanges(true);
        setShowIngredientModal(false);
        setSelectedIngredientToReplace(null);
    };

    const handleSave = async () => {
        if (!hasChanges) {
            onClose();
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            const updatedDish = {
                ...(isCustomDish ? {
                    name: mealDetails?.name || `Custom ${mealDetails.name}`,
                    customIngredients: localIngredients.map(ingredient => ({
                        ingredientId: ingredient.id,
                        quantity: ingredient.quantity
                    })),
                    baseDishId: mealId,
                } : {
                        name: mealDetails?.name || `Custom ${mealDetails.name}`,
                    ingredients: localIngredients.map(ingredient => ({
                        Id: ingredient.id,
                        quantity: ingredient.quantity
                    })),
                        baseDishId: mealId,

                })
            };
            if (isCustomDish) {
                const response = await fetch('/api/usercustomdish', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedDish)

                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                //const savedDishId = await response.json();
                //onSave && onSave(savedDishId);
                setHasChanges(false);
                onClose();
            } else {

                const response = await fetch(`/api/dish/${updatedDish.baseDishId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedDish)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
/*                onSave && onSave(savedDishId);*/
                setHasChanges(false);
                onClose();
            }

        } catch (error) {
            console.error('Error saving changes:', error);
            setError('Failed to save changes');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">Error: {error}</div>;
    if (!mealDetails) return null;

    return (
        <div>
            <h3>{mealDetails.name}</h3>
            <div className="ingredients-list">
                {localIngredients.map((ingredient) => (
                    <div key={ingredient.id} className="ingredient-item mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{ingredient.name}</span>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                    style={{ width: '80px' }}
                                    className="mx-2"
                                />
                                <span>g</span>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleReplaceIngredient(ingredient.id)}
                                    className="mx-2"
                                >
                                    Replace
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveIngredient(ingredient.id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button variant="primary" onClick={handleAddIngredient} className="mt-3">
                Add Ingredient
            </Button>

            <Modal show={showIngredientModal} onHide={() => setShowIngredientModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? 'Add New Ingredient' : 'Choose New Ingredient'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Available Ingredients</Form.Label>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {availableIngredients
                                .filter(ingredient =>
                                    modalMode === 'replace' ||
                                    !localIngredients.some(local => local.id === ingredient.id)
                                )
                                .map(ingredient => (
                                    <Button
                                        key={ingredient.id}
                                        variant="outline-primary"
                                        className="m-1"
                                        onClick={() => handleIngredientSelection(ingredient.id)}
                                    >
                                        {ingredient.name}
                                    </Button>
                                ))}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIngredientModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="mt-4">
                {hasChanges && (
                    <Button variant="success" onClick={handleSave} className="me-2">
                        Save Changes
                    </Button>
                )}
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
};

export default MealDetails;