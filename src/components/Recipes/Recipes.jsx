import React, { useState, useEffect } from 'react';
import { useFetchPantryItems } from '../../common/useFetchPantryItems'; // Custom hook to fetch pantry items
import styles from './RecipesStyles.module.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const pantryItems = useFetchPantryItems(); // Hook or API call to get pantry items

  useEffect(() => {
    const fetchRecipes = async () => {
      if (pantryItems.length === 0) {
        setLoading(false);
        return;
      }
      
      const ingredients = pantryItems.map(item => item.name).join(',');
      const apiKey = '707ba6516b484641b55bbefb97ee4aff'; // Replace with your actual API key
      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&ranking=2&apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('API response:', data); // Log the response to check its format

        // Ensure the response is an array
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error('Unexpected API response format:', data);
          setRecipes([]); // Set to an empty array if the format is unexpected
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [pantryItems]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.recipesContainer}>
      <h1>Recipes You Can Make</h1>
      {recipes.length === 0 ? (
        <p>No recipes found with your current ingredients.</p>
      ) : (
        <div className={styles.recipesList}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              <img src={recipe.image} alt={recipe.title} />
              <h2>{recipe.title}</h2>
              <p>Missing ingredients: {recipe.missedIngredientCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
