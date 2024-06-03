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
        <p>
          Business Name Registration, Barangay Clearance, Mayor's Permit, Bureau
          of Internal Revenue and Food and Drug Administration
        </p>
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
