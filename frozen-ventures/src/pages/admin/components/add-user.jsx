import React, { useState } from "react";

export const AddUser = () => {
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="add-user">
      <h1>Add New User</h1>

      <form>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="Role"
              value={selectedRole}
              onChange={(e) =>  setSelectedRole(e.target.value)}
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
