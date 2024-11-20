import React from 'react';

export default function AddIngredient() {
    return (
        <main>
            <form className="add-ingredient--form">
                <div>
                    <label>Ingredient name:
                        <input
                            type="text"
                            placeholder="Name"
                            className="form--input">
                        </input>
                    </label>
                    <label>Kcal:
                        <input
                            type="text"
                            placeholder="Kcal value"
                            className="form--input">
                        </input>
                    </label>
                    <label>Protein:
                        <input
                            type="text"
                            placeholder="Protein value"
                            className="form--input">
                        </input>
                    </label>
                    <label>Carbo:
                        <input
                            type="text"
                            placeholder="Carbo Value"
                            className="form--input">
                        </input>
                    </label>
                    <label>Fat:
                        <input
                            type="text"
                            placeholder="Fat Value"
                            className="form--input">
                        </input>
                    </label>
                    <button
                        className="form--button"
                    >
                       Add Ingredient
                    </button>
                </div>
            </form>
        </main>
    )
}
