import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { Minus, Plus, Trash } from "phosphor-react";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import { useNavigate } from "react-router-dom";

export const CartItems = ({ cartItems, setCartItems, updateSubTotal }) => {
  const { user } = useContext(UserContext);
  const [selectedId, setSelectedId] = useState({
    accountId: "",
    productId: "",
    priceId: "",
  });
  const [selectedProductName, setSelectedProductName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/manageCart.php?accountId=${user.accountId}`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user.accountId, setCartItems]);

  useEffect(() => {
    const subTotal = cartItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
    updateSubTotal(subTotal);
  }, [cartItems, updateSubTotal]);

  const handleQuantityChange = (
    productId,
    priceId,
    newQuantity,
    productPrice,
    productStock,
    totalPrice
  ) => {
    const newTotalPrice = Number(productPrice * newQuantity).toFixed(2);

    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.productID === productId && cartItem.priceID === priceId
          ? {
              ...cartItem,
              quantity: Math.min(
                Math.max(1, newQuantity),
                cartItem.productStock
              ),
              totalPrice: Number(productPrice * newQuantity).toFixed(2),
            }
          : cartItem
      )
    );
    axios
      .put(`http://localhost/api/manageCart.php`, {
        accountId: user.accountId,
        productId,
        priceId,
        totalPrice: newTotalPrice,
        quantity: newQuantity,
        productStock: productStock,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2000);
  };

  const handleDeleteClick = (productId, priceId, productName) => {
    setSelectedId({
      accountId: user.accountId,
      productId: productId,
      priceId: priceId,
    });
    setSelectedProductName(productName);
    setShowConfirmationPopUp(true);
  };

  const handleCancelClick = () => {
    setSelectedId([]);
    setSelectedProductName("");
    setShowConfirmationPopUp(false);
  };

  const handleConfirmDeleteClick = () => {
    axios
      .delete(`http://localhost/api/manageCart.php`, {
        data: {
          accountId: selectedId.accountId,
          productId: selectedId.productId,
          priceId: selectedId.priceId,
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          setCartItems((prevCartItems) =>
            prevCartItems.filter(
              (cartItem) =>
                !(
                  cartItem.productID === selectedId.productId &&
                  cartItem.priceID === selectedId.priceId
                )
            )
          );
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        setErrorMessage("Failed to remove product from cart");
      });
    setShowConfirmationPopUp(false);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2000);
  };

  const handleProductClick = (productId) => {
    navigate(`/individual-product/${productId}`);
  };

  return (
    <div className="cart-item">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle="Remove From Cart"
          confirmMessage={`Would you like to remove ${selectedProductName} from your cart?`}
          handleConfirm={handleConfirmDeleteClick}
          handleCancel={handleCancelClick}
        />
      )}
      <table>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr className="cart-product" key={cartItem.cartID}>
              <td className="information">
                <img
                  src={`http://localhost/api/productImages/${cartItem.productImage}`}
                  alt={cartItem.productName}
                  onClick={() => handleProductClick(cartItem.productID)}
                />
                <div className="description">
                  <p onClick={() => handleProductClick(cartItem.productID)}>
                    {cartItem.productName}
                  </p>
                  <p>{cartItem.productFlavor}</p>
                  <p>{cartItem.shopName}</p>
                  <p>{cartItem.productSize}</p>
                  <p>Php {cartItem.productPrice}</p>
                  <p>Stocks: {cartItem.productStock}</p>
                </div>
              </td>
              <td className="quantity">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.quantity - 1,
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                >
                  <Minus size={25} />
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      parseInt(e.target.value),
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.quantity + 1,
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                >
                  <Plus size={25} />
                </button>
              </td>
              <td>
                <p>Php {cartItem.totalPrice}</p>
              </td>
              <td className="delete">
                <button
                  onClick={() =>
                    handleDeleteClick(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.productName
                    )
                  }
                >
                  <Trash size={45} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};