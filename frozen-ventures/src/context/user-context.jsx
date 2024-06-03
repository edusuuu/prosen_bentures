import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const accountId = localStorage.getItem("accountId");
    const shopId = localStorage.getItem("shopId");
    const userRole = localStorage.getItem("userRole");
    return accountId ? { accountId, shopId, userRole } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("accountId", user.accountId);
      localStorage.setItem("shopId", user.shopId);
      localStorage.setItem("userRole", user.userRole);
    } else {
      localStorage.removeItem("accountId");
      localStorage.removeItem("shopId");
      localStorage.removeItem("userRole");
    }
  }, [user]);

  const addUser = (newAccountId, newShopId, newUserRole) => {
    setUser({ accountId: newAccountId, shopId: newShopId, userRole: newUserRole });
  };

  const clearUser = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    addUser,
    clearUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};
