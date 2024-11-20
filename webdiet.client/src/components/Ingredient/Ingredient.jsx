export default function Ingredient({ ingredient }) {
    if (!ingredient) {
        return <p>Wczytywanie...</p>;
    }

    return (
        
        <div className="ingredient-card">
            <h2>{ingredient.name}</h2>
            <p><strong>Kcal:</strong> {ingredient.kcal}</p>
            <p><strong>Protein:</strong> {ingredient.protein}</p>
            <p><strong>Carbo:</strong> {ingredient.carbo}</p>
            <p><strong>Fat:</strong> {ingredient.fat}</p>
        </div>
    );
}