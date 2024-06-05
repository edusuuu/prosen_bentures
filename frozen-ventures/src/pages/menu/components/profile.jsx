import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context.jsx";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import { ErrorMessage } from "../../../components/error-message.jsx";
import { SuccessMessage } from "../../../components/success-message.jsx";
import UserImg from "../../../assets/images/1.jpg";
import { NotePencil, X } from "phosphor-react";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputBirthdate, setInputBirthdate] = useState("");
  const [inputGender, setInputGender] = useState("");
  const [inputStreet, setInputStreet] = useState("");
  const [inputBarangay, setInputBarangay] = useState("");
  const [inputMunicipality, setInputMunicipality] = useState("");
  const [inputProvince, setInputProvince] = useState("");
  const [inputZip, setInputZip] = useState("");
  const [editable, setEditable] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleConfirmEditShow = () => {
    setShowConfirmationPopup(true);
  };

  const handleConfirmEditClose = () => {
    setEditable(false);
    setShowConfirmationPopup(false);
  };

  const handleSaveEdit = () => {
    handleSubmit(new Event("submit", { cancelable: true }));
    setShowConfirmationPopup(false);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost/api/managePersonalInfo.php?accountId=${user.accountId}`
      )
      .then((response) => {
        const userData = response.data;
        setEmail(userData.email);
        setPhone(userData.phone);
        setUserRole(userData.userRole);
        setInputFirstName(userData.firstName);
        setInputLastName(userData.lastName);
        setInputBirthdate(userData.birthdate);
        setInputGender(userData.gender);
        setInputStreet(userData.street);
        setInputBarangay(userData.barangay);
        setInputMunicipality(userData.municipality);
        setInputProvince(userData.province);
        setInputZip(userData.zip);

        setMessage(response.data.message);
        if (response.data.status === 0) {
          setShowErrorMessage(true);
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Failed to load information");
        setShowErrorMessage(true);
      });

    setTimeout(() => {
      setShowErrorMessage(false);
    }, 3000);
  }, [user.accountId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPersonalData = {
      accountID: user.accountId,
      firstName: inputFirstName,
      lastName: inputLastName,
      birthdate: inputBirthdate,
      gender: inputGender,
      street: inputStreet,
      barangay: inputBarangay,
      municipality: inputMunicipality,
      province: inputProvince,
      zip: inputZip,
    };
    axios
      .post("http://localhost/api/managePersonalInfo.php", newPersonalData)
      .then((response) => {
        console.log("Response:", response.data);
        setMessage(response.data.message);
        if (response.data.status === 1) {
          setShowSuccessMessage(true);
        } else {
          setShowErrorMessage(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Failed to create account");
        setShowErrorMessage(true);
      });

    setEditable(!editable);
    setTimeout(() => {
      setShowErrorMessage(false);
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="profile">
      {showErrorMessage && <ErrorMessage message={message} />}
      {showSuccessMessage && <SuccessMessage message={message} />}
      <form className="user" onSubmit={handleSubmit}>
        {showConfirmationPopup && (
          <ConfirmationPopUp
            confirmTitle="Save"
            confirmMessage="Would you like to save your information?"
            handleConfirm={handleSaveEdit}
            handleCancel={handleConfirmEditClose}
          />
        )}
        <div className="user-profile">
          <img src={UserImg} alt="User" />
          <div className="account-info">
            <p>{email ? email : "No email"}</p>
            <p>{phone ? phone : "No phone number"}</p>
            <p>{userRole ? userRole : "No role"}</p>
          </div>
          <button
            type="button"
            onClick={editable ? handleConfirmEditShow : handleEditClick}
          >
            <NotePencil size={30} /> <p>{editable ? "Save" : "Edit"}</p>
          </button>
          {editable && (
            <button onClick={handleConfirmEditClose}>
              <X size={30} /> <p>Cancel</p>
            </button>
          )}
        </div>
        <div className="user-info">
          <h2>User Information</h2>
          <div className="info">
            <div className="field-container">
              <div className="field">
                <label htmlFor="firstName">First Name:</label>
                <input
                  name="firstName"
                  id="firstName"
                  type="text"
                  readOnly={!editable}
                  value={inputFirstName}
                  onChange={(e) => setInputFirstName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  name="lastName"
                  id="lastName"
                  type="text"
                  readOnly={!editable}
                  value={inputLastName}
                  onChange={(e) => setInputLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="birthdate">Birthdate:</label>
                <input
                  name="birthdate"
                  id="birthdate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  readOnly={!editable}
                  value={inputBirthdate}
                  onChange={(e) => setInputBirthdate(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="gender">Gender:</label>
                <select
                  name="gender"
                  id="gender"
                  disabled={!editable}
                  value={inputGender}
                  onChange={(e) => setInputGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
          </div>
          <h2>Address</h2>
          <div className="info">
            <div className="field-container">
              <div className="field">
                <label htmlFor="street">Street:</label>
                <input
                  name="street"
                  id="street"
                  type="text"
                  readOnly={!editable}
                  value={inputStreet}
                  onChange={(e) => setInputStreet(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="barangay">Barangay:</label>
                <input
                  name="barangay"
                  id="barangay"
                  type="text"
                  readOnly={!editable}
                  value={inputBarangay}
                  onChange={(e) => setInputBarangay(e.target.value)}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="municipality">Municipality:</label>
                <input
                  name="municipality"
                  id="municipality"
                  type="text"
                  readOnly={!editable}
                  value={inputMunicipality}
                  onChange={(e) => setInputMunicipality(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="province">Province:</label>
                <input
                  name="province"
                  id="province"
                  type="text"
                  readOnly={!editable}
                  value={inputProvince}
                  onChange={(e) => setInputProvince(e.target.value)}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="zip">Zip:</label>
                <input
                  name="zip"
                  id="zip"
                  type="text"
                  readOnly={!editable}
                  value={inputZip}
                  onChange={(e) => setInputZip(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
