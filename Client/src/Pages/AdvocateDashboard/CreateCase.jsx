import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import CustomAlert from '../../Components/CustomAlert';

const categoryOptions = {
    "Civil / Debt Matters": ["Civil Debt Recovery", "Cheque Bounce", "Civil Litigation", "Consumer Court", "Documentation"],
    "Corporate & Business": ["Corporate Law", "Arbitration", "Banking / Finance", "Startup", "Tax"],
    "Criminal / Property": ["Criminal Litigation", "Cyber Crime", "Landlord / Tenant", "Property", "Revenue"],
    "Personal & Family": ["Child Custody", "Divorce", "Family Dispute", "Muslim Law", "Wills / Trusts"],
    "Labour & Service": ["Labour Law", "Service Matters", "Medical Negligence", "Motor Accident"],
    "Intellectual Property": ["Trademark & Copyright", "Property Redevelopment"],
    "Others": ["Armed Forces Tribunal", "Immigration", "Insurance", "International Law", "Notary", "Supreme Court", "Others"]
};

function CreateCase() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        advocatefirstname: '',
        advocatelastname: '',
        usertype: '',
        casetitle: '',
        category: '',
        specialization: '',
        advocateEmail: '',
        clientname: '',
        clientemail: '',
        caseDescription: '',
        isActive: true
    });

    const [alertMessage, setAlertMessage] = useState("");

    // Fetch advocate data on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);

            setFormData(prev => ({
                ...prev,
                usertype: decoded.usertype || '',
                advocateEmail: decoded.email || ''
            }));

            // Fetch advocate name using email
            const fetchAdvocateName = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/advocate/getAdvocateByEmail/${decoded.email}/${decoded.usertype}`);
                    if (response.data) {
                        const { firstname, lastname } = response.data;
                        setFormData(prev => ({
                            ...prev,
                            advocatefirstname: firstname,
                            advocatelastname: lastname
                        }));
                    }
                } catch (error) {
                    console.error('Failed to fetch advocate name:', error);
                }
            };

            fetchAdvocateName();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Reset specialization if category changes
        if (name === 'category') {
            setFormData(prev => ({ ...prev, specialization: '' }));
        }
    };

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting case data:", formData);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${apiUrl}/advocate/createCase`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            triggerAlert(response.data.message);

            // Reset the form except advocate info
            setFormData(prev => ({
                ...prev,
                casetitle: '',
                category: '',
                specialization: '',
                clientname: '',
                clientemail: '',
                caseDescription: ''
            }));
        } catch (error) {
            console.error('Failed to create case:', error);
            triggerAlert(error.response?.data?.message || 'Failed to create case');
        }
    };

    return (
        <center>
            <div className='caseForm flex items-center justify-center'>
                <div className="container mt-4">
                    <h2>Create New Case</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Advocate First Name</label>
                            <input
                                type="text"
                                name="advocatefirstname"
                                value={formData.advocatefirstname}
                                readOnly
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Advocate Last Name</label>
                            <input
                                type="text"
                                name="advocatelastname"
                                value={formData.advocatelastname}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">User Type</label>
                            <input
                                type="text"
                                name="usertype"
                                value={formData.usertype}
                                readOnly
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Advocate Email</label>
                            <input
                                type="email"
                                name="advocateEmail"
                                value={formData.advocateEmail}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {alertMessage && <CustomAlert message={alertMessage} />}

                        <div className="mb-3">
                            <label className="form-label">Case Title</label>
                            <input
                                type="text"
                                name="casetitle"
                                value={formData.casetitle}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="">Select Category</option>
                                {Object.keys(categoryOptions).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Specialization</label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                                className="form-select"
                                disabled={!formData.category}
                            >
                                <option value="">Select Specialization</option>
                                {formData.category && categoryOptions[formData.category].map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Client Name</label>
                            <input
                                type="text"
                                name="clientname"
                                value={formData.clientname}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Client Email</label>
                            <input
                                type="email"
                                name="clientemail"
                                value={formData.clientemail}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Case Description</label>
                            <textarea
                                name="caseDescription"
                                value={formData.caseDescription}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <button type="submit" className="caseButton">Create Case</button>
                    </form>
                </div>
            </div>
        </center>
    );
}

export default CreateCase;
