import React, { useContext, useState, useEffect } from "react";
import "./assets/styles/products.css";
import axios from "axios";
import { UserContext } from "./context/user-context";
import { useNavigate, useLocation } from "react-router-dom";

export const Products = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  let shopType = "";
  if (user?.userRole === "customer" || user?.userRole == "") {
    shopType = "retailer";
  } else if (user?.userRole === "retailer") {
    shopType = "distributor";
  } else if (user?.userRole === "distributor") {
    shopType = "manufacturer";
  } else {
    shopType = "retailer";
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/getProductsByRole.php?shopType=${shopType}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopType]);

  const handleProductClick = (productID) => {
    navigate(`/individual-product/${productID}`);
  };

  const displayedProducts = location.pathname === "/" ? products.slice(0, 4) : products;

  return (
    <>
      {displayedProducts.map((product) => (
        <div
          className="product-item-individual"
          key={product.productID}
          onClick={() => handleProductClick(product.productID)}
        >
          <img
            src={`http://localhost/api/productImages/${product.productImage}`}
            alt={product.productName}
          />
          <div className="product-details">
            <p className="product-name">{product.productName}</p>
            <p>
              <span>Flavor: </span>
              {product.productFlavor}
            </p>
            <p>
              <span>Shop: </span>
              {product.shopName}
            </p>
            <div className="details">
              <p>{product.productSize}</p>
              <p>Php {product.productPrice}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};