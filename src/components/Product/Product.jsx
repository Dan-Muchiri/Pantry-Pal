import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductStyles.module.css';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [newProductItem, setNewProductItem] = useState({
    brand_name: '',
    quantity: 0,
    expiry_date: '',
    product_id: id
  });
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit form visibility
  const [editProduct, setEditProduct] = useState({
    name: '',
    category: '',
    unit: '',
    storage_place: '',
    low_limit: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://pantry-pal-backend-l9st.onrender.com/products/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const item = await response.json();
        setProduct(item);
        // Initialize edit form values
        setEditProduct({
          name: item.name,
          category: item.category,
          unit: item.unit,
          storage_place: item.storage_place,
          low_limit: item.low_limit
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddProductItem = async () => {
    try {
      // First, add the new product item
      const response = await fetch(`https://pantry-pal-backend-l9st.onrender.com/product_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProductItem),
      });

      if (response.ok) {
        const addedItem = await response.json();

        // Update the product quantity
        const updatedProduct = {
          ...product,
          quantity: product.quantity + addedItem.quantity
        };

        // PATCH request to update the product's quantity
        const updateResponse = await fetch(`https://pantry-pal-backend-l9st.onrender.com/products/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ quantity: updatedProduct.quantity }),
        });

        if (updateResponse.ok) {
          setProduct((prevProduct) => ({
            ...prevProduct,
            product_items: [...prevProduct.product_items, addedItem],
            quantity: updatedProduct.quantity
          }));
          setShowForm(false); // Hide the form after adding the item
          setNewProductItem({ brand_name: '', quantity: 0, expiry_date: '' }); // Reset the form fields
        } else {
          console.error('Failed to update product quantity');
        }
      } else {
        console.error('Failed to add product item');
      }
    } catch (error) {
      console.error('Error adding product item:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSaveProduct = async () => {
    try {
      const response = await fetch(`https://pantry-pal-backend-l9st.onrender.com/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        setIsEditing(false); // Hide the edit form after saving
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.productDetailContainer}>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Quantity: {product.quantity} {product.unit}</p>
      <p>Storage Place: {product.storage_place}</p>
      <p>Low limit: {product.low_limit} {product.unit}</p>

      {/* Button to show/hide the form */}
      <button onClick={() => setShowForm(!showForm)} className={styles.addProductItemButton}>
        {showForm ? 'Cancel' : `Add new purchased ${product.name}`}
      </button>

      {/* Form to add a new product item */}
      {showForm && (
        <div className={styles.addProductItemForm}>
          <input
            type="text"
            name="brand_name"
            placeholder="Brand Name"
            value={newProductItem.brand_name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newProductItem.quantity}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="expiry_date"
            placeholder="Expiry Date"
            value={newProductItem.expiry_date}
            onChange={handleInputChange}
          />
          <button onClick={handleAddProductItem}>Add Product Item</button>
        </div>
      )}

      {/* Button to toggle edit mode */}
      <button onClick={() => setIsEditing(!isEditing)} className={styles.editProductButton}>
        {isEditing ? 'Cancel Editing' : 'Edit Product'}
      </button>

      {/* Form to edit product attributes */}
      {isEditing && (
        <div className={styles.editProductForm}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editProduct.name}
            onChange={handleEditChange}
          />
          <select name="category" value={editProduct.category} onChange={handleEditChange}>
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
          <select name="unit" value={editProduct.unit} onChange={handleEditChange}>
            <option value="" disabled>Select Unit</option>
            <option value="pieces">pieces</option>
            <option value="liters">liters</option>
            <option value="kilograms">kilograms</option>
          </select>
          <select name="storage_place" value={editProduct.storage_place} onChange={handleEditChange}>
            <option value="" disabled>Select Storage Place</option>
            <option value="Pantry">Pantry</option>
            <option value="Fridge">Fridge</option>
            <option value="Freezer">Freezer</option>
          </select>
          <input
            type="number"
            name="low_limit"
            placeholder="Low Limit"
            value={editProduct.low_limit}
            onChange={handleEditChange}
          />
          <button onClick={handleSaveProduct}>Save Changes</button>
        </div>
      )}

      {/* Product Items Table */}
      {product.product_items && product.product_items.length > 0 && (
        <table className={styles.productItemsTable}>
          <thead>
            <tr>
              <th>Brand Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {product.product_items.map((item, index) => (
              <tr key={index}>
                <td>{item.brand_name}</td>
                <td>{item.quantity}</td>
                <td>{item.expiry_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Product;
