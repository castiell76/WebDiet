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
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedMeal, setEditedMeal] = useState(null);
    const [editedIngredients, setEditedIngredients] = useState([]);
    const [localIngredients, setLocalIngredients] = useState([]);
    const [selectedIngredientToReplace, setSelectedIngredientToReplace] = useState([]);
    const [modalMode, setModalMode] = useState('replace');
    const [userCustomDish, setUserCustomDish] = useState({
        name: "marek",
        baseDishId:"",
        customIngredients: [],
    });

    useEffect(() => {
        if (mealDetails) {
            setLocalIngredients(mealDetails.ingredients);
        }
    }, [mealDetails]);

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



    const handleMealSelect = (meal) => {
        setSelectedMeal(meal);
        onMealSelect(meal);
        setShowModal(false);
        setEditedIngredients(meal.ingredients || []);
        setShowEditModal(true);
    };



    const handleReplaceIngredient = (ingredientId) => {
        setSelectedIngredientToReplace(ingredientId);
        setShowIngredientModal(true);
    };

    const handleAddIngredient = () => {
        setModalMode('add');
        setShowIngredientModal(true);
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

        setShowIngredientModal(false);
        setSelectedIngredientToReplace(null);
    };

    const saveAllChanges = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const updatedDish = {
                name: userCustomDish?.name || `Custom ${selectedMeal.name}`,
                customIngredients: localIngredients.map(ingredient => ({
                    ingredientId: ingredient.id,
                    quantity: ingredient.quantity
                })),
                baseDishId: selectedMeal.id,
            };

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

            const savedDish = await response.json();
            setUserCustomDish(savedDish);

            // Odœwie¿ szczegó³y dania po zapisaniu zmian
            await fetchMealDetails();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleQuantityChange = (ingredientId, newQuantity) => {
        setLocalIngredients(prevIngredients =>
            prevIngredients.map(ingredient =>
                ingredient.id === ingredientId
                    ? { ...ingredient, quantity: newQuantity }
                    : ingredient
            )
        );
    };


    const handleRemoveIngredient = (ingredientId) => {
        setLocalIngredients(prevIngredients =>
            prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
    };

    const fetchMealDetails = async () => {
        if (!selectedMeal) return;

        setLoading(true);
        setError(null);

        try {
            // Najpierw sprawdŸ, czy istnieje w³asna wersja dania
            const token = localStorage.getItem("jwtToken");
            const customDishResponse = await fetch(`/api/usercustomdish/${selectedMeal.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (customDishResponse.ok) {
                // Jeœli znaleziono w³asn¹ wersjê, u¿yj jej
                const customData = await customDishResponse.json();
                setUserCustomDish(customData);
                setMealDetails({
                    ...selectedMeal,
                    ingredients: customData.customIngredients
                });
            } else {
                // Jeœli nie ma w³asnej wersji, pobierz bazow¹ wersjê dania
                const baseResponse = await fetch(`/api/dish/${selectedMeal.id}`);
                if (!baseResponse.ok) {
                    throw new Error('Failed to fetch meal details');
                }
                const baseData = await baseResponse.json();
                setMealDetails(baseData);
                setUserCustomDish(null);
            }
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
                <Modal.Title>
                    {modalMode === 'add' ? 'Dodaj nowy sk³adnik' : 'Wybierz nowy sk³adnik'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Dostêpne sk³adniki</Form.Label>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {availableIngredients
                            // Opcjonalnie: filtruj sk³adniki, które ju¿ s¹ na liœcie podczas dodawania
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
                        {localIngredients.map((ingredient) => (
                            <li key={`${ingredient.id}-${ingredient.name}`} className="mb-2">
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
                                        onClick={() => {
                                            setModalMode('replace');
                                            handleReplaceIngredient(ingredient.id);
                                        }}
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
                    <Button
                        variant="success"
                        onClick={handleAddIngredient}
                        className="mt-3"
                    >
                        Dodaj nowy sk³adnik
                    </Button>
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
                                onClick={handleShowDetail}
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
                            {filteredMeals.map((meal) => {
                                if (!meal || !meal.id) {
                                    return null; 
                                }

                                return (
                                    <Dropdown.Item
                                        key={meal.id}
                                        onClick={() => {
                                            handleMealSelect(meal); 
                                            setShowModal(false);
                                        }}
                                    >
                                        {meal.name}
                                    </Dropdown.Item>
                                );
                            })}
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

                    <Button
                        variant="success"
                        onClick={() => {
                            saveAllChanges();
                            setShowModalDetail(false)
                        }}
                    >
                        Save changes
                    </Button>
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