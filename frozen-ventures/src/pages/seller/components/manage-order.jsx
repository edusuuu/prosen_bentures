import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";

const ManageOrder = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const userRole = user.userRole;
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Order Request");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/fetchOrders.php?userRole=${userRole}&userId=${userId}`);
      const data = await response.json();
      setOrders(data);
    };

    fetchData();
  }, [userRole, userId]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (orders.length > 0) {
        const customerId = orders[0].targetId;
        const response = await fetch(`/fetchCustomerInfo.php?customerId=${customerId}`);
        const data = await response.json();
        setCustomerInfo(data);
      }
    };

    fetchCustomerInfo();
  }, [orders]);

  const handleFilterClick = (value) => {
    setFilter(value);
  };

  const filteredOrders = orders.filter(({ order }) => {
    return true;
  });

  const handleAcceptOrder = (order) => {
    // not sure if may function na dito
  };

  const handleAcceptRequest = (order) => {
   // not sure if may function na dito
  };

  const handleConfirmAction = async () => {
    // not sure if may function na dito

  const handleCancelAction = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  return (
    <div className="manage-order">
      <h1>Manage Order</h1>
  
      <div className="order-container">
        <div className="button-group">
        <button
            className={filter === "Order Request" ? "active" : ""}
            onClick={() => handleFilterClick("Order Request")}
          >
            Order Requests
          </button>
          <button
            className={filter === "Accepted Order" ? "active" : ""}
            onClick={() => handleFilterClick("Accepted Order")}
          >
            Accepted Orders
          </button>
          <button
            className={filter === "Cancel Requested" ? "active" : ""}
            onClick={() => handleFilterClick("Cancel Requested")}
          >
            Cancel Requests
          </button>
          <button
            className={filter === "Refund Request" ? "active" : ""}
            onClick={() => handleFilterClick("Refund Request")}
          >
            Refund Requests
          </button>
          <button
            className={filter === "Returned Order" ? "active" : ""}
            onClick={() => handleFilterClick("Returned Order")}
          >
            Returned Orders
          </button>
          <button
            className={filter === "Completed" ? "active" : ""}
            onClick={() => handleFilterClick("Completed")}
          >
            Completed
          </button>
          <button
            className={filter === "Cancelled" ? "active" : ""}
            onClick={() => handleFilterClick("Cancelled")}
          >
            Cancelled
          </button>
        </div>
  
        {filteredOrders.length > 0 ? (
          <div className="order-item-container">
            {/* Iterate over filtered orders and display order items */}
            {filteredOrders.map(({ targetId, orderId, order }) => (
              <div className="order-item" key={`${targetId}-${orderId}`}>
                <div className="order-info">
                  {/* Display customer information and order details */}
                  <p>{/* Customer name */}</p>
                  <p>
                    <span>Status:</span> {/* Order status */}
                  </p>
                  <p>
                    <span>Order Date:</span> {/* Order date */}
                  </p>
                </div>
  
                {Object.keys(order).map((key) => {
                  const isRetailer = userRole === "retailer";
                  const prefix = isRetailer ? "pid-" : "dpid-";
  
                  if (key.startsWith(prefix)) {
                    return (
                      <div className="product" key={key}>
                        <div className="product-info">
                          {/* Display product image, name, price, shop name */}
                          <img src={order[key].productImage} alt={order[key].productName} />
                          <div className="product-description">
                            <p>{/* Product name */}</p>
                            <p>Php {/* Product price */}</p>
                            <p>{/* Shop name */}</p>
                          </div>
                        </div>
  
                        {/* Display quantity, total, shipping date, shipping mode */}
                        <div className="info">
                          <span>Quantity:</span>
                          <p>x{order.quantity}</p>
                        </div>
                        {/* More info about the product and order */}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <h2>
              Section <span>Empty</span>
            </h2>
            <p>
              No <span>records</span> found for this <span>section</span>
            </p>
          </div>
        )}
      </div>
  
      {/* Display error message */}
      {errorMessage && (
        <div className="error-message">
          <h2>Error</h2>
          <p>Cannot accept this order, product low on stock</p>
        </div>
      )}
  
      {/* ui for pop up confirmation*/}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Order Confirmation</h2>
            <p>{popupMessage}</p>
            <div className="button-group">
              <button onClick={handleConfirmAction}>Confirm</button>
              <button onClick={handleCancelAction}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ManageOrder;
