import React, { useState, useEffect } from "react";

export const UserList = () => {
  const [inputUserId, setInputUserId] = useState("");
  const [selectRole, setSelectRole] = useState("All");

  return (
    <div className="user-list">
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
              <th>User ID</th>
              <th>Role</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      </div>

      <div className="edit-user">
        <h1>Edit User</h1>
        <form className="header">
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
      </div>
    </div>
  );
};
