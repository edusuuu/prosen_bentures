import React, { useState, useEffect } from "react";
import {
  getPendingUsers,
  getPendingUsersByRole,
  updateUserStatus,
} from "../../../firebase/firebase-admin";
import { motion as m, easeInOut } from "framer-motion";

export const VerifyDocs = () => {
  const [userList, setUserList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");

  const fetchUsers = async () => {
    try {
      let users;
      switch (selectedRole) {
        case "Retailer":
          users = await getPendingUsersByRole("Retailer");
          break;
        case "Distributor":
          users = await getPendingUsersByRole("Distributor");
          break;
        case "Manufacturer":
          users = await getPendingUsersByRole("Manufacturer");
          break;
        default:
          users = await getPendingUsers();
      }
      setUserList(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleVerify = async (userId) => {
    try {
      await updateUserStatus(userId, "verified");
      // Refresh the page after successful verification
      window.location.reload();
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="verify-docs"
    >
      <h1>Pending Users</h1>

      <div className="button-container">
        <button
          className={selectedRole === "All" ? "active" : ""}
          onClick={() => setSelectedRole("All")}
        >
          All
        </button>
        <button
          className={selectedRole === "Retailer" ? "active" : ""}
          onClick={() => setSelectedRole("Retailer")}
        >
          Retailers
        </button>
        <button
          className={selectedRole === "Distributor" ? "active" : ""}
          onClick={() => setSelectedRole("Distributor")}
        >
          Distributors
        </button>
        <button
          className={selectedRole === "Manufacturer" ? "active" : ""}
          onClick={() => setSelectedRole("Manufacturer")}
        >
          Manufacturers
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>document here</td>
              <td>
                <button
                  onClick={() => handleVerify(user.id)}
                  disabled={user.status === "verified"}
                >
                  Verify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </m.div>
  );
};
