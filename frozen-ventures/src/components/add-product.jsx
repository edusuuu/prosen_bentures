import React from "react";
import "../assets/styles/components.css";

export const AddProduct = ({
  newProductData,
  showAddProductPopup,
  handleSubmit,
  handleImageChange,
  imagePreview,
  handleProductFormChange,
  handleCancelAddProductClick,
  handleAddProductClick
}) => {
  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
            required={showAddProductPopup}
          />
        </div>

        <div className="image-preview">
          {newProductData.productImage && (
            <img src={imagePreview} alt="Product" />
          )}
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={newProductData.productName}
              onChange={handleProductFormChange}
            />
          </div>

          <div className="input-field">
            <label htmlFor="productFlavor">Product Flavor:</label>
            <input
              type="text"
              id="productFlavor"
              name="productFlavor"
              value={newProductData.productFlavor}
              onChange={handleProductFormChange}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productDescription">Product Description:</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={newProductData.productDescription}
              onChange={handleProductFormChange}
            ></textarea>
          </div>
        </div>
      </form>
      <div className="button-group">
          <button onClick={handleCancelAddProductClick}>
            Cancel
          </button>
          <button onClick={handleAddProductClick}>Add</button>
        </div>
    </div>
  );
};
