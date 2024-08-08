import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductStyles.module.css';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://pantry-pal-backend-l9st.onrender.com/products/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const item = await response.json();
        setProduct(item);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.productDetailContainer}>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Quantity: {product.quantity} {product.unit}</p>
      <p>Storage Place: {product.storage_place}</p>
      <p>Low limit: {product.low_limit} {product.unit}</p>

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
