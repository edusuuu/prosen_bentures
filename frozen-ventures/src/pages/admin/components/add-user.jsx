import React, { useState } from "react";
import {
  getLatestUserId,
  addUserAccountInfo,
  addUserPersonalInfo,
} from "../../../firebase/firebase-users";
import {
  validateContactNumber,
  validateEmail,
  validatePassword,
  validateImage,
} from "../../auth/utilities/sign-validation";
import { emailExists, phoneExists } from "../../../firebase/firebase-users";
import { IdGenerator } from "../../auth/utilities/id-generator";
import { motion as m, easeInOut } from "framer-motion";

export const AddUser = () => {
  const [inputFName, setInputFName] = useState("");
  const [inputLName, setInputLName] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputBirthdate, setInputBirthdate] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = [];
    setSuccessMessage("");

    if (!selectedRole) {
      formErrors.push("Role is required");
    } else if (!inputFName) {
      formErrors.push("First name is required");
    } else if (!inputLName) {
      formErrors.push("Last name is required");
    } else if (!inputPhone) {
      formErrors.push("Phone is required");
    } else if (!inputBirthdate) {
      formErrors.push("Birthdate is required");
    } else if (!inputEmail) {
      formErrors.push("Email is required");
    } else if (!selectedGender) {
      formErrors.push("Gender is required");
    } else if (!inputPass) {
      formErrors.push("Password is required");
    } else if (!inputCPass) {
      formErrors.push("Confirm password is required");
    } else if (inputPass !== inputCPass) {
      formErrors.push("Passwords do not match");
    } else if (!validateContactNumber(inputPhone)) {
      formErrors.push("Invalid phone number");
    } else if (await phoneExists(inputPhone)) {
      formErrors.push("Phone number already exists");
    } else if (!validateEmail(inputEmail)) {
      formErrors.push("Invalid email address");
    } else if (await emailExists(inputEmail)) {
      formErrors.push("Email address already exists");
    } else if (!validatePassword(inputPass) || !validatePassword(inputCPass)) {
      formErrors.push(
        "Password must include an uppercase letter, symbol, and be at least 6 characters."
      );
    } else if (
      selectedRole === "Retailer" ||
      selectedRole === "Distributor" ||
      selectedRole === "Manufacturer"
    ) {
      if (!selectedImage) {
        formErrors.push("Image is required");
      } else if (!validateImage(selectedImage)) {
        formErrors.push(
          "Invalid image, must be 10MB or less and have a .jpg, .jpeg, or .png extension"
        );
      }
    }

    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const latestUserId = await getLatestUserId();
      const userId = IdGenerator(latestUserId);
      await addUserAccountInfo(
        {
          inputPass,
          inputPhone,
          inputEmail,
          selectedRole,
        },
        userId
      );
      await addUserPersonalInfo(
        {
          inputFName,
          inputLName,
          inputPass,
          inputBirthdate,
          selectedGender,
          selectedImage: "MIYAW",
        },
        userId
      );
      setSuccessMessage("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      setErrors(["Error adding user. Please try again."]);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="add-user"
    >
      <h1>Add New User</h1>

      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <div key={index} className="alert-error">
                <p>{error}</p>
              </div>
            ))}
          </div>
        )}
        {successMessage && (
          <div className="success-container">
            <p>{successMessage}</p>
          </div>
        )}
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="Role"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Retailer">Retailer</option>
              <option value="Distributor">Distributor</option>
              <option value="Manufacturer">Manufacturer</option>
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={inputFName}
              onChange={(e) => setInputFName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={inputLName}
              onChange={(e) => setInputLName(e.target.value)}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="input-field gender">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={selectedGender}
              onChange={handleGenderChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="RatherNotSay">Rather not say</option>
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="phoneNum">Phone Number:</label>
            <input
              type="number"
              id="phoneNum"
              name="phoneNum"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label htmlFor="birthdate">Birthdate:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={inputBirthdate}
              onChange={(e) => setInputBirthdate(e.target.value)}
              max={today}
            />
          </div>
        </div>

        <div className="input-container">
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
            <label htmlFor="confirmPass">Confirm Password:</label>
            <input
              type="password"
              id="confirmPass"
              name="confirmPass"
              value={inputCPass}
              onChange={(e) => setInputCPass(e.target.value)}
            />
          </div>
        </div>

        {(selectedRole === "Retailer" ||
          selectedRole === "Distributor" ||
          selectedRole === "Manufacturer") && (
          <div className="input-field image-upload">
            <label htmlFor="imageUpload">Choose Image:</label>
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="submit-btn">
          <button type="submit">Submit</button>
        </div>
      </form>
    </m.div>
  );
};
