import React, { useState, useEffect } from 'react';
import useAuthStore from '../../common/AuthStore';
import styles from './PantryStyles.module.css';

function Pantry() {
  const [pantryItems, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [storagePlaceFilter, setStoragePlaceFilter] = useState('All');
  const { username, userPicture } = useAuthStore();

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/products', {
          method: 'GET',
          credentials: 'include',
        });
        const items = await response.json();
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query, category, and storage space
  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStoragePlace = storagePlaceFilter === 'All' || item.storage_place === storagePlaceFilter;
    return matchesSearch && matchesCategory && matchesStoragePlace;
  });

  const handleClick = (item) => {
    // Handle the click event for a pantry item
    console.log('Clicked item:', item);
    // You can add more logic here to navigate to a detail page or show more info
  };

  return (
    <div className={styles.pantryContainer}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img className={styles.userPicture} src={userPicture} alt="User" />
          <span className={styles.username}>{username}</span>
        </div>
        <input
          type="text"
          placeholder="Search for product..."
          className={styles.searchBar}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.filters}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={styles.filter}>
          <option value="All">All Categories</option>
          <option value="Beverages">Beverages</option>
          <option value="Meat">Meat</option>
          <option value="Dairy">Dairy</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Snacks">Snacks</option>
          {/* Add more categories as needed */}
        </select>
        <select value={storagePlaceFilter} onChange={(e) => setStoragePlaceFilter(e.target.value)} className={styles.filter}>
          <option value="All">All Storage Places</option>
          <option value="Fridge">Fridge</option>
          <option value="Freezer">Freezer</option>
          <option value="Pantry">Pantry</option>
        </select>
      </div>
      <div className={styles.pantryList}>
        {filteredItems.map(item => (
          <button key={item.id} className={styles.pantryItem} onClick={() => handleClick(item)}>
            <span>{item.name}</span>
            <span>{item.quantity} {item.unit}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pantry;
