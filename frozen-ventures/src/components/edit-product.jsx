import React from "react";
import "../assets/styles/components.css";

export const EditProduct = ({
  editTitle,
  editProductData,
  handleEditFormChange,
  handleCancelEditProduct,
  handleSubmitEdit,
}) => {
  return (
    <div className="edit-product">
      <h2>{editTitle}</h2>
      <form onSubmit={handleSubmitEdit}>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={editProductData.productName}
              onChange={handleEditFormChange}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productDescription">Product Description:</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={editProductData.productDescription}
              onChange={handleEditFormChange}
            ></textarea>
          </div>
        </div>
        <div className="button-group">
          <button type="button" onClick={handleCancelEditProduct}>
            Cancel
          </button>
          <button type="submit">Edit</button>
        </div>
      </form>
    </div>
  );
};
