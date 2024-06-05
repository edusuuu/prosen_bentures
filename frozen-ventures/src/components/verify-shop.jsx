import React from "react";
import "../assets/styles/components.css";

export const VerifyShop = ({
  handleFileChange,
  handleCancel,
  handleSubmit,
}) => {
  return (
    <div className="verify-shop">
      <h1>Verify Shop</h1>

      <div className="text-container">
        <p>Please insert the ff into a single PDF file:</p>
        <ul>
          <li> Business Name Registration</li>
          <li>Barangay Clearance</li>
          <li>Mayor's Permit</li>
          <li>Bureau of Internal Revenue</li>
          <li>and Food and Drug Administration</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="shopImage">Document:</label>
          <input
            type="file"
            id="shopImage"
            name="shopImage"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <div className="button-group">
          <button onClick={handleCancel}>Cancel</button>
          <button type="submit">Verify Shop</button>
        </div>
      </form>
    </div>
  );
};
