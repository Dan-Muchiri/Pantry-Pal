import { useState, useEffect } from 'react';

export const useFetchPantryItems = () => {
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/products');
        const data = await response.json();
        setPantryItems(data);
      } catch (error) {
        console.error('Error fetching pantry items:', error);
      }
    };

    fetchPantryItems();
  }, []);

  return pantryItems;
};
