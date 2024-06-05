import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user-context";
import "../../assets/styles/individual-product.css";
import axios from "axios";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";
import { Minus, Plus, UserCircle } from "phosphor-react";
import { useParams } from "react-router-dom";

export const IndividualProduct = () => {
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/getIndividualProduct.php",
          {
            params: { productId: productId },
          }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/manageInventory.php",
          {
            params: { productId: productId },
          }
        );
        setPrice(response.data);
        if (response.data.length > 0) {
          setSelectedPrice(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching product prices:", error);
      }
    };

    fetchProduct();
    fetchPrice();
  }, [productId]);

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    const selected = price.find((p) => p.productSize === selectedSize);
    setSelectedPrice(selected);
    setQuantity(1);
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(
      1,
      Math.min(selectedPrice.productStock, Number(event.target.value))
    );
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) =>
      Math.min(selectedPrice.productStock, prevQuantity + 1)
    );
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const totalPrice = Number(
    selectedPrice ? selectedPrice.productPrice * quantity : 0
  ).toFixed(2);

  const handleAddToCartClick = () => {
    if (user?.accountId == null) {
      setErrorMessage("You must be signed in to add items to your cart");
    } else {
      const newCartItem = {
        accountId: user.accountId,
        productId: productId,
        priceId: selectedPrice.priceID,
        shopId: selectedPrice.shopID,
        quantity: quantity,
        totalPrice: totalPrice,
      };
      axios
        .post("http://localhost/api/manageCart.php", newCartItem)
        .then((response) => {
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage(
            "An error occurred while adding the product to the cart"
          );
        });

      console.log(newCartItem);
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  const handleBuyNowClick = () => {
    if (user?.accountId == null) {
      setErrorMessage("You must be signed in to buy this product");
    } else {
      // ADD CONTEXT PROCEED TO OTHER PAGE
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="container individual-product">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {product ? (
        <div className="product-details">
          <div className="header-container">
            <div className="product-header">
              {product.shopLogo ? (
                <img
                  src={`http://localhost/api/${product.shopLogo}`}
                  alt="Shop Logo"
                />
              ) : (
                <UserCircle size={60} />
              )}
              <p>{product.shopName}</p>
            </div>

            <p>
              <span>Total Price: </span>Php {totalPrice}
            </p>
          </div>

          <div className="product">
            <img
              src={`http://localhost/api/productImages/${product.productImage}`}
              alt={product.productName}
            />
            <div className="product-info">
              <div className="info">
                <p className="name">{product.productName}</p>
                <p className="price">Php {selectedPrice?.productPrice}</p>
              </div>

              <div className="info">
                <p>
                  <span>Flavor:</span> {product.productFlavor}
                </p>
                <p>
                  <span>Stocks:</span> {selectedPrice?.productStock}
                </p>

                <div className="input-container">
                  <label>Size:</label>
                  <select
                    name="productSize"
                    id="productSize"
                    onChange={handleSizeChange}
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    {price.map((p) => (
                      <option key={p.priceID} value={p.productSize}>
                        {p.productSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="description">{product.productDescription}</p>
            </div>
          </div>

          <div className="footer-container">
            <div className="quantity-container">
              <p>Quantity:</p>

              <div className="quantity">
                <button onClick={decrementQuantity}>
                  <Minus size={25} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={selectedPrice?.productStock}
                />
                <button onClick={incrementQuantity}>
                  <Plus size={25} />
                </button>
              </div>
            </div>

            <div className="button-group">
              <button onClick={handleAddToCartClick}>Add to Cart</button>
              <button onClick={handleBuyNowClick}>Buy Now</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
