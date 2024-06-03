import React, { useContext, useState } from "react";
import "../../assets/styles/admin.css";
import { UserContext } from "../../context/user-context";
import {
  Gauge,
  Storefront,
  Truck,
  ClockCounterClockwise,
  Coin,
  Cube,
  Kanban,
  Envelope,
  CaretRight,
  CaretLeft,
  ShoppingCart,
} from "phosphor-react";

export const HomeAdmin = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("shop-performance");
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="container admin">
      <div className={`side-bar ${isExpanded ? "expanded" : ""}`}>
        {isExpanded ? (
          <CaretLeft
            className="toggle-sidebar"
            size={30}
            onClick={toggleSidebar}
          />
        ) : (
          <CaretRight
            className="toggle-sidebar"
            size={30}
            onClick={toggleSidebar}
          />
        )}
        <ul>
          <li
            className={activeItem === "user-list" ? "active" : ""}
            onClick={() => handleItemClick("user-list")}
            data-tooltip="User List"
          >
            <Gauge size={40} />
            {isExpanded && <p>User List</p>}
          </li>
          <li
            className={activeItem === "add-user" ? "active" : ""}
            onClick={() => handleItemClick("add-user")}
            data-tooltip="Add User"
          >
            <Truck size={40} />
            {isExpanded && <p>Add User</p>}
          </li>
          <li
            className={activeItem === "verify-docs" ? "active" : ""}
            onClick={() => handleItemClick("verify-docs")}
            data-tooltip="Verify Documents"
          >
            <Coin size={40} />
            {isExpanded && <p>Verify Documents</p>}
          </li>
          <li
            className={activeItem === "inbox" ? "active" : ""}
            onClick={() => handleItemClick("inbox")}
            data-tooltip="Inbox"
          >
            <Envelope size={40} />
            {isExpanded && <p>Inbox</p>}
          </li>
        </ul>
      </div>
      <div
        className="selected-item"
        style={{ marginLeft: isExpanded ? "15vw" : "5vw" }}
      >
        {activeItem === "performance" && <p>sad</p>}
      </div>
    </div>
  );
};
