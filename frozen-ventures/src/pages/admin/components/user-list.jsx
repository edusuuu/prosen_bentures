import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  getAdmins,
  getCustomers,
  getRetailers,
  getDistributors,
  getManufacturers,
  fetchUserInfoById,
  updateUserById as updateUserFirebase,
} from "../../../firebase/firebase-admin";
import {
  validateContactNumber,
  validateEmail,
  validatePassword,
} from "../../auth/utilities/sign-validation";
import { motion as m, AnimatePresence, easeInOut } from "framer-motion";

export const UserList = () => {
  const [inputUserId, setInputUserId] = useState("");
  const [inputFName, setInputFName] = useState("");
  const [inputLName, setInputLName] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputBirthdate, setInputBirthdate] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectRole, setSelectRole] = useState("All");
  const [showEditForm, setShowEditForm] = useState(false);
  const [idErrors, setIdErrors] = useState([]);
  const [editErrors, setEditErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleShowEditForm = (e) => {
    setShowEditForm(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users;
        switch (selectRole) {
          case "Admin":
            users = await getAdmins();
            break;
          case "Customer":
            users = await getCustomers();
            break;
          case "Retailer":
            users = await getRetailers();
            break;
          case "Distributor":
            users = await getDistributors();
            break;
          case "Manufacturer":
            users = await getManufacturers();
            break;
          default:
            users = await getAllUsers();
        }
        setUserList(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [selectRole]);

  useEffect(() => {
    if (idErrors.length > 0) {
      const timer = setTimeout(() => {
        setIdErrors([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [idErrors]);

  useEffect(() => {
    if (editErrors.length > 0) {
      const timer = setTimeout(() => {
        setEditErrors([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editErrors]);

  const handleSubmitId = async (e) => {
    e.preventDefault();
    const formErrors = [];
    setIdErrors([]);

    if (!inputUserId) {
      formErrors.push("UserId is required");
    }

    if (inputUserId === "2024-0001") {
      formErrors.push("UserId 2024-0001 cannot be edited");
    }

    if (formErrors.length > 0) {
      setIdErrors(formErrors);
      return;
    }

    try {
      const userInfo = await fetchUserInfoById(inputUserId);
      if (userInfo) {
        setInputFName(userInfo.personalInfo.firstName);
        setInputLName(userInfo.personalInfo.lastName);
        setInputPass(userInfo.accountInfo.password);
        setInputCPass(userInfo.accountInfo.password);
        setInputPhone(userInfo.accountInfo.phone);
        setInputEmail(userInfo.accountInfo.email);
        setInputBirthdate(userInfo.personalInfo.birthdate);
        setSelectedRole(userInfo.accountInfo.role);
        setSelectedGender(userInfo.personalInfo.gender);
        setShowEditForm(true);
      } else {
        setIdErrors(["User not found"]);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      setIdErrors(["Error fetching user information"]);
    }
  };

  const handleSubmitEdit = async (e) => {
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
    } else if (!validateEmail(inputEmail)) {
      formErrors.push("Invalid email address");
    } else if (!validatePassword(inputPass) || !validatePassword(inputCPass)) {
      formErrors.push(
        "Password must include an uppercase letter, symbol, and be at least 6 characters."
      );
    }

    if (formErrors.length > 0) {
      setEditErrors(formErrors);
      return;
    }

    try {
      const updateResult = await updateUserFirebase(inputUserId, {
        personalInfo: {
          firstName: inputFName,
          lastName: inputLName,
          birthdate: inputBirthdate,
          gender: selectedGender,
        },
        accountInfo: {
          role: selectedRole,
          password: inputPass,
          phone: inputPhone,
          email: inputEmail,
        },
      });

      if (updateResult.success) {
        setSuccessMessage(updateResult.message);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setEditErrors([updateResult.message]);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setEditErrors(["Error updating user. Please try again."]);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="user-list"
    >
      <h1>User List</h1>

      <div className="button-container">
        <button
          className={selectRole === "All" ? "active" : ""}
          onClick={() => setSelectRole("All")}
        >
          All
        </button>
        <button
          className={selectRole === "Admin" ? "active" : ""}
          onClick={() => setSelectRole("Admin")}
        >
          Admin
        </button>
        <button
          className={selectRole === "Customer" ? "active" : ""}
          onClick={() => setSelectRole("Customer")}
        >
          Customers
        </button>
        <button
          className={selectRole === "Retailer" ? "active" : ""}
          onClick={() => setSelectRole("Retailer")}
        >
          Retailers
        </button>
        <button
          className={selectRole === "Distributor" ? "active" : ""}
          onClick={() => setSelectRole("Distributor")}
        >
          Distributors
        </button>
        <button
          className={selectRole === "Manufacturer" ? "active" : ""}
          onClick={() => setSelectRole("Manufacturer")}
        >
          Manufacturers
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.id}</p>
              </td>
              <td>
                <p>{user.role}</p>
              </td>
              <td>
                <p>{user.firstName}</p>
              </td>
              <td>
                <p>{user.lastName}</p>
              </td>
              <td>
                <p>{user.email}</p>
              </td>
              <td>
                <p>{user.phone}</p>
              </td>
              <td>
                <p>{user.status}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="edit-user">
        <h1>Edit User</h1>
        <form className="header" onSubmit={handleSubmitId}>
          <AnimatePresence>
            {idErrors.length > 0 && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="error-container"
              >
                {idErrors.map((error, index) => (
                  <div key={index} className="alert-error">
                    <p>{error}</p>
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {successMessage && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="success-container"
              >
                <p>{successMessage}</p>
              </m.div>
            )}
          </AnimatePresence>
          <div className="ib-container">
            <div className="input-field">
              <label htmlFor="userId">Edit User:</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
              />
            </div>

            <button type="submit">Edit</button>
          </div>
        </form>

        <AnimatePresence>
          {showEditForm && (
            <m.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: easeInOut }}
              className="edit-form"
              onSubmit={handleSubmitEdit}
            >
              <AnimatePresence>
                {editErrors.length > 0 && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeInOut }}
                    className="error-container"
                  >
                    {editErrors.map((error, index) => (
                      <div key={index} className="alert-error">
                        <p>{error}</p>
                      </div>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {successMessage && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeInOut }}
                    className="success-container"
                  >
                    <p>{successMessage}</p>
                  </m.div>
                )}
              </AnimatePresence>
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

              <div className="submit-btn">
                <button onClick={handleShowEditForm}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </m.form>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
};
