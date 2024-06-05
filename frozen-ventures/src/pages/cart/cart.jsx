import React, { useContext, useState } from "react";
import "../../assets/styles/cart.css";
import { UserContext } from "../../context/user-context";
import { OrderContext } from "../../context/order-context";
import { CartItems } from "./components/cart-item";
import { Navigate, Link } from "react-router-dom";
import { ErrorMessage } from "../../components/error-message";
import { ShoppingCart, Storefront } from "phosphor-react";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const { setOrder } = useContext(OrderContext);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orderSet, setOrderSet] = useState(false);
  const [cartItemError, setCartItemError] = useState(false);
  const [errorProduct, setErrorProduct] = useState(null);

  const updateSubTotal = (subTotal) => {
    setCartSubTotal(subTotal);
  };

  const handleCheckout = async () => {
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const orderDetails = {
        products: cartItems.reduce((acc, curr) => {
          const subTotal =
            parseFloat(curr.productPrice) * parseInt(curr.quantity);
          if (curr.quantity > curr.productStock) {
            setErrorProduct(curr.productName);
            setCartItemError(true);

            setTimeout(() => {
              setCartItemError(false);
              setErrorProduct(null);
            }, 3000);

            throw new Error(
              `Quantity for ${curr.productName} exceeds available stock.`
            );
          }

          acc[curr.productID] = {
            productId: curr.productID,
            priceId: curr.priceID,
            shopId: curr.shopID,
            productImage: curr.productImage,
            productName: curr.productName,
            productFlavor: curr.productFlavor,
            productSize: curr.productSize,
            productPrice: curr.productPrice,
            quantity: curr.quantity,
            shopName: curr.shopName,
            subTotal: subTotal.toFixed(2),
            status: "pending",
            orderDate: currentDate,
          };
          return acc;
        }, {}),
      };

      
      setOrder(orderDetails);
      setOrderSet(true);
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  if (orderSet) {
    return <Navigate to="/order" replace />;
  }

  return (
    <div className="container cart">
      {user.userRole !== "customer" ? <Navigate to="/" replace={true} /> : null}
      {cartItemError && (
        <ErrorMessage
          message={`Quantity for ${errorProduct} exceeds available stock`}
        />
      )}

      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart Items</h1>

          <div className="checkout">
            <p>
              <span>Sub Total: </span>Php {cartSubTotal.toFixed(2)}
            </p>

            <button
              className="checkOutButton"
              onClick={handleCheckout}
              disabled={cartSubTotal === 0}
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="cart-item">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Remove</th>
              </tr>
            </thead>
          </table>
        </div>

        {cartItems ? (
          <div className="cart-items">
            <CartItems
              cartItems={cartItems}
              setCartItems={setCartItems}
              updateSubTotal={updateSubTotal}
            />
          </div>
        ) : (
          <div key="empty-cart" className="empty-cart">
            <div className="message-one">
              <span>
                <ShoppingCart size={50} />
              </span>
              <h2>
                Your <span>cart</span> is empty
              </h2>
            </div>

            <div className="message-two">
              <p>
                <span>Venture</span> into the <span>product catalog</span>, and
                maybe you'll find something <span>frosty</span>.
              </p>
              <Link to="/shop">
                <button>
                  <Storefront size={32} />
                  Browse Shop
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
