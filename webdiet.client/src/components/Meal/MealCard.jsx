import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MealCard({ mealType, description, imagePath }) {
    return (
        <Card style={{ width: '25rem' }}>
            <Card.Img variant="top" src={imagePath} />
            <Card.Body>
                <Card.Title>{mealType}</Card.Title>
                <Card.Text>
                    {description }
                </Card.Text>
                <Button>Show details</Button>
                <Button variant="primary">Replace Meal</Button>
            </Card.Body>
        </Card>
    );
}

export default MealCard;