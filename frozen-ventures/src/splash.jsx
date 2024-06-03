import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/user-context";
import "./assets/styles/splash.css";
import Logo from "./assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import { WhisperSpinner } from "react-spinners-kit";

export const Splash = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (user.userRole == "admin") {
        setTimeout(() => {
          navigate("/home-admin");
        }, 3000);
      } else if (
        user.userRole == "retailer" ||
        user.userRole == "distributor" ||
        user.userRole == "manufacturer"
      ) {
        setTimeout(() => {
          navigate("/home-seller");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch {
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    }
  }, []);

  return (
    <div className="loading">
      <div className="header">
        <img src={Logo} />
        <p>FrozenVentures</p>
      </div>
      <WhisperSpinner
        size={200}
        color="#533d70"
        frontColor="#533d70"
        backColor="#533d70"
        loading={loading}
      />
    </div>
  );
};
