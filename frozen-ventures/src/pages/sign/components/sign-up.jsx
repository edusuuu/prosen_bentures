import React, { useState } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";

export const SignUp = () => {
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [accountData, setAccountData] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    const newAccountData = {
      email: inputEmail,
      phone: inputPhone,
      userRole: userRole,
      password: inputPass,
      confirmPass: inputCPass,
    };
    setAccountData(newAccountData);
    axios
      .post("http://localhost/api/signup.php", newAccountData)
      .then((response) => {
        console.log("Response:", response.data);
        setMessage(response.data.message);
        if (response.data.status === 1) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            window.location.reload();
          }, 3500);
        } else {
          setShowErrorMessage(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Failed to create account");
        setShowErrorMessage(true);
      })

      setTimeout(() => {
        setIsSigningUp(false);
        setShowErrorMessage(false);
        setShowSuccessMessage(false);
      }, 3000);
  };

  return (
    <div className="sign-up">
      {showErrorMessage && <ErrorMessage message={message} />}
      {showSuccessMessage && <SuccessMessage message={message} />}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="userRole">User Role:</label>
            <select
              id="userRole"
              name="userRole"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="customer">Customer</option>
              <option value="retailer">Retailer</option>
              <option value="distributor">Distributor</option>
              <option value="manufacturer">Manufacturer</option>
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="emailAdd">Email Address:</label>
            <input
              type="text"
              id="emailAdd"
              name="emailAdd"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
            />
          </div>

          <div className="password-container">
            <div className="input-field">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={inputCPass}
                onChange={(e) => setInputCPass(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" disabled={isSigningUp}>
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};
