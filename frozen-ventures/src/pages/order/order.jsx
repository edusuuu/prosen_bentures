import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/order.css";
import axios from "axios";
import { OrderContext } from "../../context/order-context";
import { UserContext } from "../../context/user-context";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/error-message";
import { SuccessMessage } from "../../components/success-message";
import { ConfirmationPopUp } from "../../components/confirmation-popup";

const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const Order = () => {
  const { user } = useContext(UserContext);
  const { orderProducts, clearOrder } = useContext(OrderContext);
  const { products } = orderProducts || {};
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zip: "",
  });
  const [isEditingShippingMode, setIsEditingShippingMode] = useState(false);
  const [isEditingShippingDate, setIsEditingShippingDate] = useState(false);
  const [showConfirmOrder, setShowConfirmOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [shippingMode, setShippingMode] = useState("pickup");

  let totalProductAmount = 0;
  let productFee = 0;

  if (products) {
    for (const productId in products) {
      const product = products[productId];
      totalProductAmount += product.productPrice * product.quantity;
      productFee += product.productPrice * product.quantity * 0.01;
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost/api/getPersonalAccountInfo.php?accountId=${user.accountId}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.accountId]);

  const shippingCost =
    shippingMode === "pickup" ? 0 : 10 * Object.keys(products).length;
  const totalOrderCost =
    parseFloat(totalProductAmount) +
    parseFloat(shippingCost) +
    parseFloat(productFee);

  const handleEditUserInfo = () => {
    navigate("/menu");
  };

  const handleEditShippingAddress = () => {
    navigate("/menu");
  };

  const handleEditShippingMode = () => {
    setIsEditingShippingMode(!isEditingShippingMode);
  };

  const handleShippingModeChange = (mode) => {
    setShippingMode(mode);
    setIsEditingShippingMode(false);
  };

  const handleEditShippingDate = () => {
    setIsEditingShippingDate(!isEditingShippingDate);
  };

  const isShippingAddressEmpty = () => {
    const { street, barangay, municipality, province, zip } = userData;
    return !street || !barangay || !municipality || !province || !zip;
  };

  const getCurrentDate = () => {
    return new Date();
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate;
  };

  const [shippingDate, setShippingDate] = useState(getCurrentDate());

  useEffect(() => {
    setShippingDate(getCurrentDate());
  }, []);

  const handleShippingDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setShippingDate(selectedDate);
    setIsEditingShippingDate(false);
  };

  const handlePlaceOrderClick = () => {
    if (isShippingAddressEmpty()) {
      setErrorMessage("Order Unsuccessful: Address cannot be incomplete");

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else {
      setShowConfirmOrder(true);
    }
  };

  const handleConfirmCancelClick = () => {
    setShowConfirmOrder(false);
  };

  const handlePlaceOrder = () => {
    for (const productId in products) {
      const product = products[productId];

      const productFee = product.productPrice * product.quantity * 0.01;
      const shippingFee =
        shippingMode === "delivery" ? 10 * product.quantity : 0;
      const totalPrice =
        Number(product.subTotal) + Number(productFee) + Number(shippingFee);

      const orderData = {
        accountId: user.accountId,
        productId: product.productId,
        priceId: product.priceId,
        orderDate: formatDate(product.orderDate),
        shippingMode: shippingMode,
        receiveDate: formatDate(shippingDate),
        status: product.status,
        quantity: product.quantity,
        totalPrice: totalPrice.toFixed(2),
      };

      try {
        axios
          .post("http://localhost/api/manageOrder.php", orderData)
          .then((response) => {
            if (response.data.status === 1) {
                clearOrder();
                setSuccessMessage(response.data.message);
            } else if (response.data.status === 0) {
                setErrorMessage(response.data.message);
            } else {
                setErrorMessage("Something went wrong");
            }
          });
      } catch (error) {
        console.error("There was an error placing the order:", error);
      }
    }

    setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setShowConfirmOrder(false);
        navigate("/");
    }, 2000);
  };

  return (
    <div className="container order">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmOrder && (
        <ConfirmationPopUp
          confirmTitle={"Confirm Order"}
          confirmMessage={"Are you certain you wish to place order?"}
          handleCancel={handleConfirmCancelClick}
          handleConfirm={handlePlaceOrder}
        />
      )}
      <header>
        <h2>Order Confirmation</h2>

        <div className="tb-container">
          {totalProductAmount > 0 ? (
            <>
              <p>
                Order Total: <span>Php {totalOrderCost.toFixed(2)}</span>
              </p>
              <button onClick={handlePlaceOrderClick}>Place Order</button>
            </>
          ) : null}
        </div>
      </header>

      <div className="informations">
        <div className="info">
          <div className="title-info">
            <h3>Your Information</h3>
            <button onClick={handleEditUserInfo}>Edit</button>
          </div>

          <h4>
            {userData.firstName} {userData.lastName}
          </h4>
          <p>{userData.email}</p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Address</h3>
            <button onClick={handleEditShippingAddress}>Edit</button>
          </div>

          <p>
            {userData.street} {userData.barangay} {userData.municipality}{" "}
            {userData.province} {userData.zip}
          </p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Mode</h3>
            <button onClick={handleEditShippingMode}>Edit</button>
          </div>
          {isEditingShippingMode ? (
            <div className="ship-group">
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("pickup")}
              >
                Pickup
              </button>
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("delivery")}
              >
                Delivery
              </button>
            </div>
          ) : (
            <p>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}
            </p>
          )}
        </div>

        <div className="info">
          <div className="title-info">
            <h3>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}{" "}
              Date
            </h3>
            <button onClick={handleEditShippingDate}>Edit</button>
          </div>
          {isEditingShippingDate ? (
            <input
              className="ship-date"
              type="date"
              min={formatDate(getCurrentDate())}
              max={formatDate(getMaxDate())}
              value={formatDate(shippingDate)}
              onChange={handleShippingDateChange}
            />
          ) : (
            <p>{formatDate(shippingDate)}</p>
          )}
        </div>
      </div>

      <div className="item-container">
        <h2>Order Items</h2>

        <div className="order-item">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Retailer</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                Object.entries(products).map(([productId, product]) => (
                  <tr key={productId}>
                    <td>
                      <img
                        src={`http://localhost/api/productImages/${product.productImage}`}
                        alt={product.productName}
                      />
                      <div className="description">
                        <p>{product.productName}</p>
                        <p>{product.productFlavor}</p>
                        <p>{product.productSize}</p>
                        <p>Php {product.productPrice}</p>
                      </div>
                    </td>
                    <td>
                      <p>{product.shopName}</p>
                    </td>
                    <td>
                      <p>x{product.quantity}</p>
                    </td>
                    <td>
                      <p>
                        Php{" "}
                        {(product.productPrice * product.quantity).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="t-container">
        <div className="total-container">
          <h2>Total Cost</h2>
          <div className="sub-total">
            <p className="label">Sub Total:</p>
            <p className="price">Php {totalProductAmount.toFixed(2)}</p>
          </div>
          <div className="shipping">
            <p className="label">Shipping Fee:</p>
            <p className="price">Php {shippingCost.toFixed(2)}</p>
          </div>
          <div className="fee">
            <p className="label">Platform Fee:</p>
            <p className="price">Php {productFee.toFixed(2)}</p>
          </div>
          <div className="line"></div>
          <div className="total">
            <p className="label">Total:</p>
            <p className="price">Php {totalOrderCost.toFixed(2)}</p>
          </div>
          <button onClick={handlePlaceOrderClick}>Place Order</button>
        </div>
      </div>
    </div>
  );
};
