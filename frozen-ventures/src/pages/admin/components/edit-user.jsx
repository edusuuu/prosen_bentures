import React, { useState } from "react";

export const EditUser = () => {
    const [inputAccountId, setInputAccountId] = useState("");

  return (
    <div className="edit-user">
      <div className="search-user">
        <h1>Edit User</h1>
        <form>
          <div className="search-container">
            <div className="input-field">
              <label htmlFor="userId">Edit User:</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={inputAccountId}
                onChange={(e) => setInputAccountId(e.target.value)}
              />
            </div>
            <button type="submit">Edit</button>
          </div>
        </form>
      </div>
    </div>
  );
};
