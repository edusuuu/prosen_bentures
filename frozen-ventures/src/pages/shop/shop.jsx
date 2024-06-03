import React from "react";
import "../../assets/styles/shop.css";
import carrousel from "../../assets/images/0.jpg";
import { Products } from "../../products";

export const Shop = () => {
  return (
    <div className="container shop">
      <div className="carrousel">
        <img src={carrousel} alt="" />
      </div>

      <div className="text-container">
        <h2>Check out the shop</h2>
        <p>Find the flavor that suits you</p>
      </div>

      <div className="button-container">
        <button className="filterButton">Peanut</button>
        <button className="filterButton">Chocolate</button>
        <button className="filterButton">Vanilla</button>
        <button className="filterButton">Mancha</button>
        <button className="filterButton">Rocky Road</button>
      </div>

      <div className="products-container">
        <Products />
      </div>
    </div>
  );
};
