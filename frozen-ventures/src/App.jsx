import React, { useState } from "react";
import "./assets/styles/App.css";
import { UserContextProvider } from "./context/user-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Splash } from "./splash";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home/home";
import { HomeAdmin } from "./pages/admin/home-admin";
import { Sign } from "./pages/sign/sign";
import { Menu } from "./pages/menu/menu";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { History } from "./pages/history/history";
import { HomeSeller } from "./pages/seller/home-seller";

function App() {
  return (
    <div className="app">
      <UserContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/splash" element={<Splash />} />
            <Route path="/" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/history" element={<History />} />

            <Route path="/home-admin" element={<HomeAdmin />} />
            <Route path="/home-seller" element={<HomeSeller />} />
          </Routes>
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
