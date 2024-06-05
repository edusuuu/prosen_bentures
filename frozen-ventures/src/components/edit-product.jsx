import React from "react";
import "../assets/styles/components.css";

export const EditProduct = ({
  editTitle,
  editProductData,
  handleEditFormChange,
  handleCancelClick,
  handleEditClick,
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

          <div className="input-field">
            <label htmlFor="productFlavor">Product Flavor:</label>
            <input
              type="text"
              id="productFlavor"
              name="productFlavor"
              value={editProductData.productFlavor}
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
      </form>
      <div className="button-group">
        <button onClick={handleCancelClick}>Cancel</button>
        <button onClick={handleEditClick}>Edit</button>
      </div>
    </div>
  );
};
