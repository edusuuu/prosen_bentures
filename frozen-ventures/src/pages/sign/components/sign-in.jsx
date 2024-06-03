import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { useNavigate } from "react-router-dom";
import { GoogleLogo } from "phosphor-react";

export const SignIn = () => {
  const { addUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsSigningIn(true);

    axios
      .post("http://localhost/api/signin.php", {
        email,
        password,
      })
      .then((response) => {
        console.log("Response:", response.data);
        setMessage(response.data.message);
        if (response.data.status === 1) {
          addUser(response.data.user.accountID, response.data.user?.shopID, response.data.user.userRole);
          setShowSuccessMessage(true);
          setTimeout(() => {
            navigate("/splash");
          }, 3000);
        } else {
          setShowErrorMessage(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Failed to create account");
        setShowErrorMessage(true);
      });

    setTimeout(() => {
      setIsSigningIn(false);
      setShowErrorMessage(false);
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="sign-in">
      {showErrorMessage && <ErrorMessage message={message} />}
      {showSuccessMessage && <SuccessMessage message={message} />}
      <form onSubmit={handleSignIn}>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
          <a href="">Forgot password?</a>
        </div>
      </form>

      <div className="sign-google">
        <div className="google-text">
          <div></div>
          <p>Or sign in with</p>
          <div></div>
        </div>

        <button disabled={isSigningIn}>
          <GoogleLogo size={32} weight="bold" />
          <p>Google</p>
        </button>
      </div>
    </div>
  );
};
