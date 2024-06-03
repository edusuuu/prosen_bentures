import React, { useContext, useState, useEffect } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  UserCircle,
  WarningCircle,
} from "phosphor-react";

export const IndividualProduct = () => {
 

  return (
    <div
      className="container individual-product"
    >
      {product && (
        <div className="product-details">
          <div className="header">
            <div className="seller">
              <UserCircle size={60} />
              <p>{product.shopName}</p>
            </div>
            <ArrowRight size={50} />
          </div>

          <div className="product">
            <img src={product.productImage} alt={product.productName} />

            <div className="product-info">
              <div className="info">
                <p className="name">{product.productName}</p>
                <p className="price">Php {product.productPrice}</p>
              </div>

              <div className="info">
                <div className="group">
                  <p>
                    <span>Flavor:</span> {product.productName}
                  </p>
                  <p>
                    <span>Size:</span> {product.productSize}
                  </p>
                  <p>
                    <span>Stocks:</span> {product.productStock}
                  </p>
                </div>

                <div className="quantity-container">
                  <span>Quantity:</span>

                  <div className="quantity">
                    <button onClick={handleDecrement} disabled={quantity <= 1}>
                      <Minus size={25} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleInputChange}
                    />
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.productStock}
                    >
                      <Plus size={25} />
                    </button>
                  </div>
                </div>

                <p className="description">{product.productDescription}</p>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showNotification && product && (
          <m.div
            className="notify success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WarningCircle size={50} />
            <p>
              <span>{product.productName}</span> has been added to your cart.
            </p>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showErrorNotification && product && (
          <m.div
            className="notify error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WarningCircle size={50} />
            <p>
              <span>{product.productName}</span> is out of stock.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};