import React, { useState, useEffect } from "react";
import "./assets/styles/products.css";
import axios from "axios";

export const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = () => {
      axios
        .get("http://localhost/api/getProductsForCustomer.php")
        .then((response) => {
          setProducts(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    };
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {products.map((product) => (
        <div className="product-item" key={product.productID}>
          <img
            src={`http://localhost/api/productImages/${product.productImage}`}
            alt={product.productName}
          />
          <div className="product-details">
            <p className="product-name">{product.productName}</p>

            <p>
              <span>Available: </span>
              {product.totalStock}
            </p>
            <div className="details">
              <p>{product.productSize}</p>
              <p>Php {product.productPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
