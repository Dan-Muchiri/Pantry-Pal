import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../common/AuthStore';
import styles from './PantryStyles.module.css';

function Pantry() {
  const [pantryItems, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [storagePlaceFilter, setStoragePlaceFilter] = useState('All');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const { username, userPicture, userId } = useAuthStore();


  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '', // Set to empty string
    storage_place: '', // Set to empty string
    quantity: 0,
    unit: '', // Set to empty string
    low_limit: '',
    user_id: userId // Add user_id field
  });
  
  const navigate = useNavigate();

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

  const handleAddProduct = async () => {
    try {
      console.log(JSON.stringify({ ...newProduct, user_id: userId }));
      const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...newProduct, user_id: userId }), // Include user_id when adding the product
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...pantryItems, addedProduct]); // Update state with new product
        setShowForm(false); // Hide the form
        setNewProduct({
          name: '',
          category: '',
          storage_place: '',
          quantity: 0,
          unit: '',
          low_limit: 0,
          user_id: userId // Reset form including user_id
        });
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStoragePlace = storagePlaceFilter === 'All' || item.storage_place === storagePlaceFilter;
    return matchesSearch && matchesCategory && matchesStoragePlace;
  });

  const handleClick = (item) => {
    navigate(`/products/${item.id}`);
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
          <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Beverages">Beverages</option>
            <option value="Grains & Pasta">Grains & Pasta</option>
            <option value="Spices & Herbs">Spices & Herbs</option>
            <option value="Condiments & Sauces">Condiments & Sauces</option>
            <option value="Eggs">Eggs</option>
            <option value="Ready Meals">Ready Meal</option>
        </select>
        <select value={storagePlaceFilter} onChange={(e) => setStoragePlaceFilter(e.target.value)} className={styles.filter}>
          <option value="All">All Storage Places</option>
          <option value="Fridge">Fridge</option>
          <option value="Freezer">Freezer</option>
          <option value="Pantry">Pantry</option>
        </select>
      </div>
      <button className={styles.addProductButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Product'}
      </button>
      {showForm && (
        <div className={styles.addProductForm}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <select name="category" value={newProduct.category} onChange={handleInputChange}>
            <option value="" disabled>Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Beverages">Beverages</option>
            <option value="Grains & Pasta">Grains & Pasta</option>
            <option value="Spices & Herbs">Spices & Herbs</option>
            <option value="Condiments & Sauces">Condiments & Sauces</option>
            <option value="Eggs">Eggs</option>
            <option value="Ready Meals">Ready Meal</option>
          </select>
          <select name="storage_place" value={newProduct.storage_place} onChange={handleInputChange}>
            <option value="" disabled>Select Storage Place</option>
            <option value="Pantry">Pantry</option>
            <option value="Fridge">Fridge</option>
            <option value="Freezer">Freezer</option>
          </select>
          <select name="unit" value={newProduct.unit} onChange={handleInputChange}>
            <option value="" disabled>Select Unit</option>
            <option value="pieces">pieces</option>
            <option value="liters">liters</option>
            <option value="kilograms">kilograms</option>
          </select>
          <input
            type="number"
            name="low_limit"
            placeholder="Low Limit"
            value={newProduct.low_limit}
            onChange={handleInputChange}
          />
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      )}
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
