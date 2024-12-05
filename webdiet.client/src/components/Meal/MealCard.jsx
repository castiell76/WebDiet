import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown, InputGroup } from 'react-bootstrap';

function MealCard({ mealType, description, imagePath, meals, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [customMeal, setCustomMeal] = useState(null);
    const [mealDetails, setMealDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedMeal, setEditedMeal] = useState(null);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleShowDetail = async () => {
        if (selectedMeal) {
            setShowModalDetail(true);
            await fetchMealDetails();
        }
    };
    const handleCloseDetail = () => {
        setShowModalDetail(false);
        setMealDetails(null);
        setError(null);
    };

    const handleMealSelect = async (meal) => {
        try {
            const response = await fetch(`/api/dish/${meal.id}`);
            if (!response.ok) throw new Error('Failed to fetch meal details');

            const mealDetails = await response.json();
            setSelectedMeal(meal);
            setEditedMeal(mealDetails);
            setShowModal(false);
            setShowEditModal(true);
        } catch (error) {
            console.error('Error fetching meal details:', error);
        }
    };

        const handleSaveCustomMeal = async () => {
        try {
            // Create custom dish only after editing is complete
            const createResponse = await fetch('/api/usercustomdish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    baseDishId: selectedMeal.id,
                    name: selectedMeal.name,
                    ingredients: editedMeal.ingredients
                })
            });

            if (!createResponse.ok) throw new Error('Failed to create custom dish');

            const customDish = await createResponse.json();
            setCustomMeal(customDish);
            onMealSelect(customDish);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error saving custom dish:', error);
        }
    };

    const addMeal = async (meal) => {
        try {
            // Create custom dish based on selected meal
            const response = await fetch('/api/usercustomdish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    baseDishId: meal.id,
                    name: meal.name
                })
            });

            if (!response.ok) throw new Error('Failed to create custom dish');

            const customDish = await response.json();
            setSelectedMeal(meal);
            setCustomMeal(customDish);
            onMealSelect(customDish);

        } catch (error) {
            console.error('Error creating custom dish:', error);
        }
        setShowModal(false);
    };


    const handleReplaceIngredient = (oldIngredientId) => {
        setEditingIngredient(oldIngredientId);
        setShowIngredientModal(true);
    };

    const handleIngredientReplacement = async (newIngredientId) => {
        try {
            const response = await fetch(`/api/userdishingredient`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userCustomDishId: customMeal.id,
                    ingredientId: newIngredientId,
                    quantity: mealDetails.ingredients.find(i => i.id === editingIngredient)?.quantity || 0
                })
            });

            if (!response.ok) throw new Error('Failed to replace ingredient');
            await fetchMealDetails();

        } catch (error) {
            console.error('Error replacing ingredient:', error);
        }
        setShowIngredientModal(false);
        setEditingIngredient(null);
    };

    const handleQuantityChange = (ingredientId, newQuantity) => {
        setEditedMeal(prev => ({
            ...prev,
            ingredients: prev.ingredients.map(ing =>
                ing.id === ingredientId ? { ...ing, quantity: newQuantity } : ing
            )
        }));
    };


    const handleRemoveIngredient = async (ingredientId) => {
        try {
            const response = await fetch(`/api/userdishingredient/${customMeal.id}/${ingredientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to remove ingredient');

            const updatedIngredients = mealDetails.ingredients.filter(ing => ing.id !== ingredientId);
            setMealDetails({
                ...mealDetails,
                ingredients: updatedIngredients
            });
        } catch (error) {
            console.error('Error removing ingredient:', error);
        }
    };

    const fetchMealDetails = async () => {
        if (!customMeal) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/usercustomdish/${customMeal.id}`);
            if (!response.ok) throw new Error('Failed to fetch meal details');

            const data = await response.json();
            setMealDetails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredMeals = meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchValue.toLowerCase())
    );

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
        }
    };

    useEffect(() => {
        if (showIngredientModal) {
            fetchAvailableIngredients();
        }
    }, [showIngredientModal]);

    const renderIngredientModal = () => (
        <Modal show={showIngredientModal} onHide={() => setShowIngredientModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Wybierz nowy sk³adnik</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Dostêpne sk³adniki</Form.Label>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {availableIngredients.map(ingredient => (
                            <Button
                                key={ingredient.id}
                                variant="outline-primary"
                                className="m-1"
                                onClick={() => handleIngredientReplacement(ingredient.id)}
                            >
                                {ingredient.name}
                            </Button>
                        ))}
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowIngredientModal(false)}>
                    Anuluj
                </Button>
            </Modal.Footer>
        </Modal>
    );

    const renderMealDetails = () => {
        if (!mealDetails) return null;
        return (
            <div>
                <h3>{mealDetails.name}</h3>
                <p>Lista sk³adników:</p>
                <div>
                    <ul className="list-unstyled">
                        {mealDetails.ingredients.map((ingredient) => (
                            <li key={ingredient.id} className="mb-2">
                                <InputGroup>
                                    <InputGroup.Text>{ingredient.name}</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                        style={{ maxWidth: '100px' }}
                                    />
                                    <InputGroup.Text>g</InputGroup.Text>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleReplaceIngredient(ingredient.id)}
                                    >
                                        Zamieñ
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemoveIngredient(ingredient.id)}
                                    >
                                        Usuñ
                                    </Button>
                                </InputGroup>
                            </li>
                        ))}
                    </ul>
                </div>
                <p><strong>Description:</strong> {mealDetails.description || 'No description available'}</p>
                <p><strong>Calories:</strong> {mealDetails.kcal || 0} kcal</p>
                <p><strong>Protein:</strong> {mealDetails.protein || 0}g</p>
                <p><strong>Carbs:</strong> {mealDetails.carbo || 0}g</p>
                <p><strong>Fat:</strong> {mealDetails.fat || 0}g</p>
                {mealDetails.allergens && (
                    <>
                        <h4>Allergens:</h4>
                        <p>{mealDetails.allergens}</p>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <Card style={{ width: '25rem' }}>
                <Card.Img variant="top" src={imagePath} alt={`${mealType} image`} />
                <Card.Body>
                    <Card.Title>{mealType}</Card.Title>
                    {customMeal && <Card.Text>{customMeal.name}</Card.Text>}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Assign Meal
                    </Button>
                </Card.Body>
            </Card>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                                    onClick={() => addMeal(meal)}>
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

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Meal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedMeal && (
                        <div>
 
                            <Button onClick={handleSaveCustomMeal}>
                                Save Changes
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {renderIngredientModal()}
        </>
    );
}

export default MealCard;