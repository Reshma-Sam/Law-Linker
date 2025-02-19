import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Container } from 'react-bootstrap'
import CustomAlert from '../../Components/CustomAlert';

const UpdateCaseForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const { caseId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        casetitle: '',
        category: '',
        specialization: '',
        caseDescription: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('')

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };



    useEffect(() => {
        const fetchCaseDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiUrl}/advocate/getcase/${caseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched Case Data:', response.data);
                const caseData = response.data.case;
                setFormData({
                    casetitle: caseData.casetitle || '',
                    category: caseData.category || '',
                    specialization: caseData.specialization || '',
                    caseDescription: caseData.caseDescription || '',
                    isActive: caseData.isActive ?? true,
                });
            } catch (error) {
                console.error('Failed to load case details:', error);
                setAlertMessage('Failed to load case details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCaseDetails();
    }, [caseId]);



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${apiUrl}/advocate/updateCase/${caseId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            triggerAlert('Case updated successfully!');
            setTimeout(() => navigate(`/caseProfile/${caseId}`), 4000);
        } catch (error) {
            triggerAlert('Failed to update case.');
        }
    };

    if (loading) return <Spinner animation="border" className="d-block mx-auto" />;

    const categories = [
        "Civil / Debt Matters", "Cheque Bounce", "Civil Litigation", "Consumer Court",
        "Documentation", "Recovery", "Corporate Law", "Arbitration", "Banking / Finance",
        "Startup", "Tax", "Trademark & Copyright", "Criminal / Property",
        "Criminal Litigation", "Cyber Crime", "Landlord / Tenant", "Property",
        "Revenue", "Personal / Family", "Child Custody", "Divorce", "Family Dispute",
        "Labour & Service", "Medical Negligence", "Motor Accident", "Muslim Law",
        "Wills / Trusts", "Others", "Armed Forces Tribunal", "Immigration",
        "Insurance", "International Law", "Notary", "Property Redevelopment", "Supreme Court"
    ];

    const specializations = [
        "civil-debt", "cheque-bounce", "civil-litigation", "consumer-court",
        "documentation", "recovery", "corporate-law", "arbitration", "banking-finance",
        "startup", "tax", "trademark-copyright", "criminal-property", "criminal-litigation",
        "cyber-crime", "landlord-tenant", "property", "revenue", "personal-family",
        "child-custody", "divorce", "family-dispute", "labour-service",
        "medical-negligence", "motor-accident", "muslim-law", "wills-trusts",
        "others", "armed-forces", "immigration", "insurance", "international-law",
        "notary", "property-redevelopment", "supreme-court"
    ];

    return (
        <div className="position-relative" >
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>
            <Container className="update-case-form-container">
                {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
                <h3 className="mb-4 text-center">Update Case Details</h3>
                <Form onSubmit={handleSubmit} className="update-case-form">
                    <Form.Group className="mb-3">
                        <Form.Label>Case Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="casetitle"
                            value={formData.casetitle}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control
                            as="select"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Specialization</option>
                            {specializations.map((specialization) => (
                                <option key={specialization} value={specialization}>{specialization}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Case Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="caseDescription"
                            rows={4}
                            value={formData.caseDescription}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Is Active"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Update Case
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default UpdateCaseForm;
