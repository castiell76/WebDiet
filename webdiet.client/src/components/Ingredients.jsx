export default function Ingredients({ ingredients }) {
    if (!ingredients || ingredients.length === 0) {
        return <p>Wczytywanie...</p>;
    }

    return (
        <div>
            {ingredients.map((ingredient, index) => (
                <div className="ingredient-card" key={index}>
                    <h2>{ingredient.name}</h2>
                    <p><strong>Kcal:</strong> {ingredient.kcal}</p>
                    <p><strong>Protein:</strong> {ingredient.protein}</p>
                    <p><strong>Carbo:</strong> {ingredient.carbo}</p>
                    <p><strong>Fat:</strong> {ingredient.fat}</p>
                </div>
            ))}
        </div>
    );
}