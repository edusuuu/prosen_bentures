import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";

export const UserList = () => {
  const [inputUserId, setInputUserId] = useState("");
  const [selectRole, setSelectRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUsers = () => {
      axios
        .get("http://localhost/api/allUsers.php")
        .then((response) => {
          setUsers(Array.isArray(response.data.data) ? response.data.data : []);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setErrorMessage("Failed to fetch users. Please try again later.");
        });
    };
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredUsers =
    selectRole === "all"
      ? users
      : users.filter((user) => user.userRole === selectRole);

  return (
    <div className="user-list">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <h1>User List</h1>

      <div className="list-container">
        <div className="button-container">
          <button
            className={selectRole === "all" ? "active" : ""}
            onClick={() => setSelectRole("all")}
          >
            All
          </button>
          <button
            className={selectRole === "admin" ? "active" : ""}
            onClick={() => setSelectRole("admin")}
          >
            Admin
          </button>
          <button
            className={selectRole === "customer" ? "active" : ""}
            onClick={() => setSelectRole("customer")}
          >
            Customers
          </button>
          <button
            className={selectRole === "retailer" ? "active" : ""}
            onClick={() => setSelectRole("retailer")}
          >
            Retailers
          </button>
          <button
            className={selectRole === "distributor" ? "active" : ""}
            onClick={() => setSelectRole("distributor")}
          >
            Distributors
          </button>
          <button
            className={selectRole === "manufacturer" ? "active" : ""}
            onClick={() => setSelectRole("manufacturer")}
          >
            Manufacturers
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Role</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.accountID}>
                <td>{user.accountID}</td>
                <td>{user.userRole}</td>
                <td>{user.firstName ? user.firstName : <>No value</>}</td>
                <td>{user.lastName ? user.lastName : <>No value</>}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
