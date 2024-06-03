import React, { useContext, useState } from "react";
import "../../assets/styles/menu.css";
import { UserContext } from "../../context/user-context";
import { Profile } from "./components/profile";
import { SetUpShop } from "./components/setup-shop";
import { Setting } from "./components/setting";
import { ConfirmationPopUp } from "../../components/confirmation-popup";
import { useNavigate } from "react-router-dom";
import {
  UserSquare,
  GearSix,
  Storefront,
  Warning,
  SignOut as SignOutIcon,
  CaretLeft,
  CaretRight,
} from "phosphor-react";

export const Menu = () => {
  const { user, clearUser } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("profile");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleSignOutClick = () => {
    setShowSignOutPopup(true);
  };

  const handleSignOutConfirm = () => {
    clearUser();
    navigate("/");
    setShowSignOutPopup(false);
  };

  const handleSignOutCancel = () => {
    setShowSignOutPopup(false);
  };

  return (
    <div className="container menu">
      {showSignOutPopup && (
        <ConfirmationPopUp
          confirmTitle="Sign Out"
          confirmMessage="Would you like to sign out?"
          handleConfirm={handleSignOutConfirm}
          handleCancel={handleSignOutCancel}
        />
      )}
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
            className={activeItem === "profile" ? "active" : ""}
            onClick={() => handleItemClick("profile")}
            data-tooltip="Profile"
          >
            <UserSquare size={40} />
            {isExpanded && <p>Profile</p>}
          </li>
          {user.userRole !== "customer" && user.userRole !== "admin" && (
            <li
              className={activeItem === "setup-shop" ? "active" : ""}
              onClick={() => handleItemClick("setup-shop")}
              data-tooltip="Set Up Shop"
            >
              <Storefront size={40} />
              {isExpanded && <p>Set Up Shop</p>}
            </li>
          )}
          <li
            className={activeItem === "settings" ? "active" : ""}
            onClick={() => handleItemClick("settings")}
            data-tooltip="Settings"
          >
            <GearSix size={40} />
            {isExpanded && <p>Settings</p>}
          </li>
          <li
            className={activeItem === "report" ? "active" : ""}
            data-tooltip="Report A Problem"
          >
            <Warning size={40} />
            {isExpanded && <p>Report A Problem</p>}
          </li>
          <li
            className={activeItem === "signout" ? "active" : ""}
            onClick={handleSignOutClick}
            data-tooltip="Sign Out"
          >
            <SignOutIcon size={40} />
            {isExpanded && <p>Sign Out</p>}
          </li>
        </ul>
      </div>

      <div
        className="selected-item"
        style={{ marginLeft: isExpanded ? "15vw" : "5vw" }}
      >
        {activeItem === "profile" && <Profile />}
        {activeItem === "setup-shop" && <SetUpShop />}
        {activeItem === "settings" && <Setting />}
      </div>
    </div>
  );
};
