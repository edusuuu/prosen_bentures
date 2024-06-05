import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";
import { CheckCircle, NotePencil, X } from "phosphor-react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import { VerifyShop } from "../../../components/verify-shop";
import ShopImg from "../../../assets/images/1.jpg";

export const SetUpShop = () => {
  const { user } = useContext(UserContext);
  const [newShopData, setNewShopData] = useState({
    accountID: user.accountId,
    shopName: "",
    shopDescription: "",
    shopImage: "",
    shopType: user.userRole,
  });
  const [shop, setShop] = useState([]);
  const [personalInfo, setPersonalInfo] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [editable, setEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerifyShop, setShowVerifyShop] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const accountId = user.accountId;
  useEffect(() => {
    const fetchShopInfo = () => {
      axios
        .get(
          `http://localhost/api/setUpShop.php?accountId=${accountId}&status=1`
        )
        .then((response) => {
          const shopData = Array.isArray(response.data) ? response.data[0] : {};
          setShop(shopData);
          setNewShopData({
            accountID: shopData?.accountID || user.accountId,
            shopName: shopData?.shopName || "",
            shopDescription: shopData?.shopDescription || "",
            shopImage: shopData?.shopLogo || "",
            shopType: shopData?.shopType || user.userRole,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchShopInfo();
  }, [accountId]);

  const handleEditClick = () => {
    axios
      .get(`http://localhost/api/managePersonalInfo.php?accountId=${user.accountId}`)
      .then((response) => {
        setPersonalInfo(Array.isArray(response.data) ? response.data : []);
      });

    if (personalInfo.length == 0) {
      setErrorMessage("Please edit your personal information first");
      setTimeout(() => {
        setErrorMessage("");
      }, 2500);
    } else {
      setEditable(!editable);
    }
  };

  const handleConfirmEditShow = () => {
    setShowConfirmationPopup(true);
  };

  const handleConfirmEditClose = () => {
    setEditable(false);
    setShowConfirmationPopup(false);
  };

  const handleVerifyClick = () => {
    setShowVerifyShop(true);
  };

  const handleCancelClick = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setShowVerifyShop(false);
  };

  const handleShopFormChange = (e) => {
    const { name, value } = e.target;
    setNewShopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveShop = (e) => {
    e.preventDefault();

    if (newShopData.shopName === "" || newShopData.shopDescription === "") {
      setErrorMessage("Fields cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("shopImage", imageFile);
    formData.append("shopImageName", imageFile.name);
    formData.append("shopImageType", imageFile.type);

    axios
      .post("http://localhost/api/uploadShopLogo.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((uploadResponse) => {
        if (uploadResponse.data.status === 1) {
          const imagePath = uploadResponse.data.imagePath;
          const shopDataToSend = {
            ...newShopData,
            shopImage: imagePath,
          };

          axios
            .post("http://localhost/api/setUpShop.php", shopDataToSend)
            .then((response) => {
              if (response.data.status === 1) {
                setSuccessMessage("Shop information saved successfully");
                setErrorMessage("");

                setTimeout(() => {
                  axios
                    .get(
                      `http://localhost/api/setUpShop.php?accountId=${accountId}&status=1`
                    )
                    .then((response) => {
                      const shopData = Array.isArray(response.data)
                        ? response.data[0]
                        : {};
                      setShop(shopData);
                      setNewShopData({
                        accountID: shopData?.accountID || user.accountId,
                        shopName: shopData?.shopName || "",
                        shopDescription: shopData?.shopDescription || "",
                        shopImage: shopData?.shopLogo || "",
                        shopType: shopData?.shopType || user.userRole,
                      });
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                  setSuccessMessage("");
                  setErrorMessage("");
                }, 2000);
              } else {
                setErrorMessage("Failed to save shop information");
                setSuccessMessage("");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              setErrorMessage(
                "An error occurred while saving the shop information"
              );
              setSuccessMessage("");
            });
        } else {
          setErrorMessage("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred while uploading the image");
      });

    setShowConfirmationPopup(false);
    setEditable(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === img.height) {
          setNewShopData((prevData) => ({
            ...prevData,
            shopImage: file.name,
          }));
          setImageFile(file);
          setErrorMessage("");
        } else {
          setErrorMessage("Please select a square image 1:1 ratio");
        }
      };
    } else {
      setErrorMessage("Please select a valid image file jpg, jpeg, png");
    }
  };

  const handleSubmitVerify = (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("shopDocument", file);

    axios
      .post("http://localhost/api/uploadShopVerificationFiles.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          const filePath = response.data.filePath;

          axios
            .post("http://localhost/api/verifyShop.php", {
              accountID: user.accountId,
              shopDocument: filePath,
            })
            .then((updateResponse) => {
              if (updateResponse.data.status === 1) {
                setSuccessMessage(updateResponse.data.message);
                setErrorMessage("");
              } else {
                setErrorMessage(updateResponse.data.message);
                setSuccessMessage("");
              }
            })
            .catch((error) => {
              console.error("Error updating shop document:", error);
              setErrorMessage("An error occurred while submiting the file");
              setSuccessMessage("");
            });
        } else {
          setErrorMessage("Failed to upload shop document");
          setSuccessMessage("");
        }
      })
      .catch((error) => {
        console.error("Error uploading shop document:", error);
        setErrorMessage("An error occurred while submiting the file");
        setSuccessMessage("");
      });
    setTimeout(() => {
      setShowVerifyShop(false);
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setErrorMessage("Only PDF files are allowed");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();

      reader.onload = (event) => {
        setFileContent(event.target.result);
        console.log("File content:", event.target.result);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsText(selectedFile);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  return (
    <div className="setup-shop">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showVerifyShop && (
        <VerifyShop
          handleCancel={handleCancelClick}
          handleSubmit={handleSubmitVerify}
          handleFileChange={handleFileChange}
        />
      )}
      <form className="shop-container" onSubmit={handleSaveShop}>
        {showConfirmationPopup && (
          <ConfirmationPopUp
            confirmTitle="Save Shop"
            confirmMessage="Would you like to save your shop information?"
            handleConfirm={handleSaveShop}
            handleCancel={handleConfirmEditClose}
          />
        )}
        <div className="shop-profile">
          {shop ? (
            <img
              src={`http://localhost/api/${shop.shopLogo}`}
              alt="Shop Logo"
            />
          ) : (
            <img src={ShopImg} />
          )}

          <div className="shop-details">
            <p>{shop?.shopName ? shop.shopName : "No shop name"}</p>
            <p>{shop?.isVerified == 1 ? "Verified" : "Not Verified"}</p>
          </div>
          <button
            type="button"
            onClick={editable ? handleConfirmEditShow : handleEditClick}
          >
            <NotePencil size={30} /> <p>{editable ? "Save" : "Edit"}</p>
          </button>
          {shop?.isVerified == 0 && (
            <button type="button" onClick={handleVerifyClick}>
              <CheckCircle size={30} /> <p>Verify</p>
            </button>
          )}
          {editable && (
            <button onClick={handleConfirmEditClose}>
              <X size={30} /> <p>Cancel</p>
            </button>
          )}
        </div>
        <div className="shop-info">
          <h2>Shop</h2>
          <div className="field-container">
            <div className="field">
              <label htmlFor="shopImage">Shop Logo:</label>
              <input
                type="file"
                id="shopImage"
                name="shopImage"
                accept=".jpg, .jpeg, .png"
                disabled={!editable}
                onChange={handleImageChange}
              />
            </div>
            <div className="field">
              <label htmlFor="shopName">Shop Name:</label>
              <input
                name="shopName"
                id="shopName"
                type="text"
                readOnly={!editable}
                value={newShopData?.shopName}
                onChange={handleShopFormChange}
              />
            </div>
            <div className="field">
              <label htmlFor="shopDescription">Shop Description:</label>
              <textarea
                name="shopDescription"
                id="shopDescription"
                type="text"
                readOnly={!editable}
                value={newShopData.shopDescription}
                onChange={handleShopFormChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
