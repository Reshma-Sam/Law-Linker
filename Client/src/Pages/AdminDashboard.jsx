import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Form, Button, Row, Col, Card } from "react-bootstrap";
import CustomAlert from "../Components/CustomAlert";

const AdminDashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    // Function to show the custom alert
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
        password: "",
    });

    const [isEditing, setIsEditing] = useState({
        profilePicture: false,
        firstname: false,
        lastname: false,
        mobile: false,
        email: false,
        username: false,
        password: false,
    });

    useEffect(() => {
        if (!userType || !id) {
            setError("Invalid user type or ID");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    `${apiUrl}/profile/${userType}/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setAdmin(response.data.user);
                    setFormData(response.data.user);
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

        fetchProfile();
    }, [userType, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const toggleEdit = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
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
    
                // Fetch updated profile from the backend
                const profileResponse = await axios.get(
                    `${apiUrl}/profile/${userType}/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (profileResponse.data.success) {
                    setFormData({ ...profileResponse.data.user });
                    setAdmin(profileResponse.data.user);
                }
            } else {
                triggerAlert("Failed to upload profile picture.");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            triggerAlert("Error uploading profile picture. Please try again.");
        }
    }    


const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        const response = await axios.put(
            `${apiUrl}/profile/${userType}/${id}`,
            { ...formData },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data.success) {
            alert("Profile updated successfully!");
            setAdmin(response.data.user);
        } else {
            triggerAlert("Failed to update profile.");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        triggerAlert("An error occurred while updating the profile.");
    }
};

if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
if (error) return <p className="text-center text-danger">{error}</p>;

return (
    <div className="position-relative">
        <div className="top-center-alert">
            <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
        </div>
        <div className="position-relative">
            <h2 className="text-center mb-4">Admin Dashboard</h2>

            <Card className="p-4 mx-auto" style={{ width: "400px", borderRadius: "15px", background: "linear-gradient(135deg, #333, #d2cfca)", color: "white" }}>
                <div className="text-center position-relative">
                    {/* Profile Picture */}
                    <img
                        src={
                            formData.profilePicture instanceof File
                                ? URL.createObjectURL(formData.profilePicture)
                                : admin?.profilePicture || "https://dummyimage.com/150"
                        }
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        onLoad={(e) => {
                            if (formData.profilePicture instanceof File) {
                                URL.revokeObjectURL(e.target.src); // Prevent memory leaks
                            }
                        }}
                        onError={(e) => {
                            e.target.src = "https://dummyimage.com/150"; // Fallback if the image fails to load
                        }}
                    />

                    {/* Edit Button - Positioned Below the Image */}
                    <Button
                        variant="light"
                        size="sm"
                        className="mt-2 d-block mx-auto" // Centered below the image
                        onClick={() => toggleEdit("profilePicture")}
                    >
                        ✎
                    </Button>

                    {/* File Input and Upload Button (Visible When Editing) */}
                    {isEditing.profilePicture && (
                        <div className="mt-2">
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                            <Button variant="dark" size="sm" className="mt-2" onClick={handleProfileUpload}>
                                Upload Profile Picture
                            </Button>
                        </div>
                    )}
                </div>

                <Form onSubmit={handleSubmit} className="mt-3">
                    <Row>
                        {["firstname", "lastname", "mobile", "email", "username", "password"].map((field) => (
                            <Col md={12} key={field} className="mb-2">
                                <Form.Group className="d-flex align-items-center">
                                    <Form.Label className="me-2" style={{ width: "40%", fontWeight: "bold" }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                    <Form.Control type={field === "password" ? "password" : "text"} name={field} value={formData[field]} onChange={handleChange} disabled={!isEditing[field]} style={{ flex: 1, fontSize: "14px", padding: "5px" }} />
                                    <Button variant="outline-light" size="sm" className="ms-2" onClick={() => toggleEdit(field)}>✎</Button>
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>
                    <Button variant="dark" type="submit" className="w-100 mt-3">Save Changes</Button>
                </Form>
            </Card>
        </div>
    </div>
);
};

export default AdminDashboard;
