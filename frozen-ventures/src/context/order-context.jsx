import React, { createContext, useState, useEffect } from "react";

export const OrderContext = createContext(null);

export const OrderContextProvider = ({ children }) => {
  const [orderProducts, setOrderProducts] = useState(() => {
    const storedOrderProducts = localStorage.getItem('orderProducts');
    try {
      return storedOrderProducts ? JSON.parse(storedOrderProducts) : null;
    } catch (error) {
      console.error("Error parsing order products from localStorage:", error);
      return null;
    }
  });

  const setOrder = (products, mode) => {
    setOrderProducts(products);
  };

  useEffect(() => {
    if (orderProducts) {
      localStorage.setItem('orderProducts', JSON.stringify(orderProducts));
    } else {
      localStorage.removeItem('orderProducts');
    }
  }, [orderProducts]);

  const clearOrder = () => {
    setOrderProducts(null);
  };

  const contextValue = {
    orderProducts,
    setOrder,
    clearOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};