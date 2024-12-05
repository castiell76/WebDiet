import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown, InputGroup } from 'react-bootstrap';

function MealCard({ mealType, description, imagePath, meals, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [mealDetails, setMealDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [availableIngredients, setAvailableIngredients] = useState([]); 

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

    const addMeal = (meal) => {
        setSelectedMeal(meal);
        onMealSelect(meal);
        setShowModal(false);
        setShowModalDetail(false);
    };


    const handleReplaceIngredient = (oldIngredientId) => {
        setEditingIngredient(oldIngredientId);
        setShowIngredientModal(true);
    };

    const handleIngredientReplacement = async (newIngredientId) => {
        try {
            const response = await fetch(`/api/dishingredient/replace`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dishId: mealDetails.id,
                    oldIngredientId: editingIngredient,
                    newIngredientId: newIngredientId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to replace ingredient');
            }

            // Odœwie¿ dane posi³ku
            await fetchMealDetails();
        } catch (error) {
            console.error('Error replacing ingredient:', error);
        }
        setShowIngredientModal(false);
        setEditingIngredient(null);
    };

    const handleQuantityChange = async (ingredientId, newQuantity) => {
        const updatedIngredients = mealDetails.ingredients.map(ing =>
            ing.id === ingredientId ? { ...ing, quantity: newQuantity } : ing
        );

        // Tworzenie nowego obiektu DishIngredient
        const dishIngredient = {
            dishId: mealDetails.id,
            ingredientId: ingredientId,
            quantity: newQuantity
        };

        try {
            const response = await fetch('/api/dishingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dishIngredient)
            });

            if (!response.ok) {
                throw new Error('Failed to update ingredient quantity');
            }

            setMealDetails({
                ...mealDetails,
                ingredients: updatedIngredients
            });
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };


    const handleRemoveIngredient = async (ingredientId) => {
        try {
            const response = await fetch(`/api/dishingredient/${mealDetails.id}/${ingredientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove ingredient');
            }

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
        if (!selectedMeal) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/dish/${selectedMeal.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch meal details');
            }
            const data = await response.json();
            setMealDetails(data);
            console.log("fetched data: ", data)
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
            const response = await fetch('/api/ingredients');
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
                    {selectedMeal && (
                        <Card.Text>{selectedMeal.name}</Card.Text>
                    )}
                    <Button variant="primary" onClick={handleShow}>
                        Assign Meal
                    </Button>
                    {selectedMeal && (
                        <Button variant="primary" onClick={handleShowDetail} className="ms-2">
                            Show meal details
                        </Button>
                    )}
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

            <Modal show={showModalDetail} onHide={handleCloseDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Meal details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">Error: {error}</p>}
                    {!loading && !error && renderMealDetails()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetail}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {renderIngredientModal()}
        </>
    );
}

export default MealCard;