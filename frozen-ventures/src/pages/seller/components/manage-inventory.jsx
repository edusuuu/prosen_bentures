import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../context/user-context";
import axios from "axios";
import { ProductStock } from "./product-stock";

export const ManageInventory = () => {
  const { user } = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [showProductStock, setShowProductStock] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const productStockRef = useRef(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/getProducts.php?accountId=${user.accountId}`
        );
        setInventory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, [user.accountId]);

  const handleShowProductStock = (productName, productId) => {
    setSelectedProductName(productName);
    setSelectedProductId(productId);
    setSelectedAccountId(user.accountId);
    setShowProductStock(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productStockRef.current &&
        !productStockRef.current.contains(event.target)
      ) {
        setShowProductStock(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCancelClick = () => {
    setShowProductStock(false);
  }

  return (
    <div className="manage-inventory">
      <h1>Manage Inventory</h1>
      {!inventory || inventory.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <div className="products-container">
          {inventory.map((product) => (
            <div
              key={product.productID}
              className="product"
              onClick={() =>
                handleShowProductStock(product.productName, product.productID)
              }
            >
              <div className="header">
                <p>
                  <span>Product ID: </span>
                  {product.productID}
                </p>
                <p>
                  <span>Date Added: </span>
                  {product.dateAdded}
                </p>
              </div>

              <img
                src={`http://localhost/api/productImages/${product.productImage}`}
              />

              <div className="product-details">
                <p>{product.productName}</p>
                <p>
                  <span>Remaining Stock: </span>
                  {product.totalStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showProductStock && (
        <div className="product-stock" ref={productStockRef}>
          <ProductStock
            handleCancelClick={handleCancelClick}
            productName={selectedProductName}
            productId={selectedProductId}
            accountId={selectedAccountId}
          />
        </div>
      )}
    </div>
  );
};
