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
    const [currentCustomDishId, setCurrentCustomDishId] = useState(customDishId);

    useEffect(() => {
        setCurrentCustomDishId(customDishId);
    }, [customDishId]);

    useEffect(() => {
        if (mealId) {
            fetchMealDetails();
        }
    }, [mealId, isCustomDish, currentCustomDishId]);

    const fetchMealDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            if (isCustomDish && currentCustomDishId) {
                response = await fetch(`/api/usercustomdish/${currentCustomDishId}`);
            } else {
                response = await fetch(`/api/dish/${mealId}`);
            }

            if (!response.ok) {
                throw new Error('Failed to fetch meal details');
            }

            const data = await response.json();
            setMealDetails(data);
            setLocalIngredients(data.ingredients);
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
                name: mealDetails?.name || `Custom ${mealDetails.name}`,
                baseDishId: mealId,
                customIngredients: localIngredients.map(ingredient => ({
                    ingredientId: ingredient.id,
                    quantity: ingredient.quantity
                }))
            };

            const method = currentCustomDishId ? 'PUT' : 'POST';
            const url = currentCustomDishId
                ? `/api/usercustomdish/${currentCustomDishId}`
                : '/api/usercustomdish';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedDish)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const savedDish = await response.json();


            setCurrentCustomDishId(savedDish.id);
            setMealDetails(savedDish);
            setLocalIngredients(savedDish.ingredients); 
            setHasChanges(false);

            onSave && onSave({
                ...savedDish,
                isCustomDish: true,
                originalMealId: mealId
            });


            await fetchMealDetails();
        } catch (error) {
            console.error('Error saving changes:', error);
            setError('Failed to save changes: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">Error: {error}</div>;
    if (!mealDetails) return null;

     return (
        <div>
            <h3>{mealDetails.name}</h3>
             <div className="ingredients-list">
                 {console.log("lokalne:",localIngredients) }
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
        </div>
    );
};

export default MealDetails;