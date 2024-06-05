import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";

export const VerifyDocs = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [userList, setUserList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost/api/allShop.php");
        if (response.data.status === 1) {
          setUserList(response.data.data);
        } else {
          setErrorMessage("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleVerify = (id) => {
    setSelectedAccountId(id);
    setShowConfirmationPopUp(true);
  };

  const handleCancelClick = () => {
    setSelectedAccountId("");
    setShowConfirmationPopUp(false);
  };

  const handleConfirmClick = async () => {
    try {
      const response = await axios.post("http://localhost/api/allShop.php", { accountID: selectedAccountId });
      if (response.data.status === 1) {
        setSuccessMessage("User verified successfully");
        setUserList((prevList) =>
          prevList.map((user) =>
            user.accountID === selectedAccountId ? { ...user, isVerified: 1 } : user
          )
        );
      } else {
        setErrorMessage("Failed to verify user");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setErrorMessage("Failed to verify user. Please try again later.");
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      setShowConfirmationPopUp(false);
    }, 2500);
  };

  const filteredUsers =
    selectedRole === "All"
      ? userList
      : userList.filter((user) => user.userRole === selectedRole);

  return (
    <div className="verify-docs">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle="Verify Shop"
          confirmMessage="Are you sure you want to verify this shop?"
          handleCancel={handleCancelClick}
          handleConfirm={handleConfirmClick}
        />
      )}
      <h1>Pending Users</h1>

      <div className="list-container">
        <div className="button-container">
          <button
            className={selectedRole === "All" ? "active" : ""}
            onClick={() => setSelectedRole("All")}
          >
            All
          </button>
          <button
            className={selectedRole === "retailer" ? "active" : ""}
            onClick={() => setSelectedRole("retailer")}
          >
            Retailers
          </button>
          <button
            className={selectedRole === "distributor" ? "active" : ""}
            onClick={() => setSelectedRole("distributor")}
          >
            Distributors
          </button>
          <button
            className={selectedRole === "manufacturer" ? "active" : ""}
            onClick={() => setSelectedRole("manufacturer")}
          >
            Manufacturers
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Shop Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>isVerified</th>
              <th>Document</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.accountID}>
                <td>{user.accountID}</td>
                <td>{user.shopName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.userRole}</td>
                <td>{user.status === 1 ? "Active" : "Inactive"}</td>
                <td>{user.isVerified === 1 ? "Verified" : "Not Verified"}</td>
                <td>
                  {user.shopDocument ? (
                    <a
                      href={`http://localhost/api/${user.shopDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  ) : (
                    "No Document"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleVerify(user.accountID)}
                    disabled={user.isVerified === 1}
                  >
                    {user.isVerified === 1 ? "Already Verified" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};