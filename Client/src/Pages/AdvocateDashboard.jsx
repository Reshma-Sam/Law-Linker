import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Form, Button, Row, Col, Card } from "react-bootstrap";
import CustomAlert from "../Components/CustomAlert";

const AdvocateDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const userType = localStorage.getItem("userType") || "";
  const id = localStorage.getItem("userId") || "";

  const [formData, setFormData] = useState({
    profilePicture: "",
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    username: "",
    barcodenumber: "",
    specialization: "",
    state: "",
    district: ""
  });

  const [isEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    mobile: false,
    username: false,
    barcodenumber: false,
    specialization: false,
    state: false,
    district: false
  });
  const [showFileInput, setShowFileInput] = useState(false);

  useEffect(() => {
    if (!userType || !id) {
      setError("Invalid user type or ID");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userType, id]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${apiUrl}/profile/${userType}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAdvocate(response.data.user);
        setFormData({
          profilePicture: response.data.user.profilePicture || "",
          firstname: response.data.user.firstname || "",
          lastname: response.data.user.lastname || "",
          mobile: response.data.user.mobile || "",
          email: response.data.user.email || "",
          username: response.data.user.username || "",
          barcodenumber: response.data.user.barcodenumber || "",
          specialization: response.data.user.specialization || "",
          state: response.data.user.state || "",
          district: response.data.user.district || ""
        });
      } else {
        triggerAlert("Failed to load profile: " + response.data.message);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      triggerAlert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const handleProfileUpload = async () => {
    if (!formData.profilePicture) {
      triggerAlert("Please select a profile picture to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    const uploadData = new FormData();
    uploadData.append("profilePicture", formData.profilePicture);

    try {
      const response = await axios.post(
        `${apiUrl}/profile/upload-profile/${userType}/${id}`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        triggerAlert("Profile picture uploaded successfully!");
        fetchProfile();
      } else {
        triggerAlert("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      triggerAlert("Error uploading profile picture. Please try again.");
    }
  };

  const handleToggleEdit = async (field) => {
    if (isEditing[field]) {
      const token = localStorage.getItem("token");
      const updateData = { [field]: formData[field] };

      try {
        const response = await axios.put(
          `${apiUrl}/profile/update/${userType}/${id}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          triggerAlert(`${field} updated successfully!`);
          setAdvocate((prev) => ({ ...prev, [field]: formData[field] }));
        } else {
          triggerAlert(`Failed to update ${field}: ${response.data.message}`);
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        triggerAlert(`Error updating ${field}`);
      }
    }
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="position-relative">
      <div className="top-center-alert">
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
      </div>
      <h2 className="text-center mb-4">Advocate Dashboard</h2>

      <Card className="p-4 mx-auto" style={{ width: "700px", borderRadius: "15px", background: "linear-gradient(135deg, #333, #d2cfca)", color: "white" }}>
        <div className="text-center">
          <img
            src={
              formData.profilePicture instanceof File
                ? URL.createObjectURL(formData.profilePicture)
                : formData.profilePicture || "https://dummyimage.com/150"
            }
            alt="Profile"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
            onLoad={(e) => {
              if (formData.profilePicture instanceof File) {
                URL.revokeObjectURL(e.target.src);
              }
            }}
            onError={(e) => {
              e.target.src = "https://dummyimage.com/150";
            }}
          />

          <Button
            variant="light"
            size="sm"
            className="mt-2 d-block mx-auto"
            onClick={() => setShowFileInput(!showFileInput)}
          >
            ✎
          </Button>

          {showFileInput && (
            <div className="mt-2">
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              <Button variant="dark" size="sm" className="mt-2" onClick={handleProfileUpload}>
                Upload Profile Picture
              </Button>
            </div>
          )}
        </div>

        <Form className="mt-3">
          <Row>
            {Object.keys(formData).map((field) => (
              ["firstname", "lastname", "mobile", "username", "barcodenumber", "specialization", "state", "district"].includes(field) && (
                <Col md={12} key={field} className="mb-2">
                  <Form.Group className="d-flex align-items-center">
                    <Form.Label className="me-2" style={{ width: "40%", fontWeight: "bold" }}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      disabled={!isEditing[field]}
                      style={{ flex: 1, fontSize: "14px", padding: "5px" }}
                    />
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleToggleEdit(field)}
                    >
                      {isEditing[field] ? "💾" : "✎"}
                    </Button>
                  </Form.Group>
                </Col>
              )
            ))}

            <Col md={12} className="mb-2">
              <Form.Group className="d-flex align-items-center">
                <Form.Label className="me-2" style={{ width: "40%", fontWeight: "bold" }}>
                  Email
                </Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email || ""}
                  disabled
                  style={{ flex: 1, fontSize: "14px", padding: "5px" }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AdvocateDashboard;
