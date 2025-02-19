import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAlert from '../Components/CustomAlert';
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CaseProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const { caseId } = useParams();
    const [caseDetails, setCaseDetails] = useState(null);
    const [evidenceList, setEvidenceList] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`${apiUrl}/advocate/getCase/${caseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setCaseDetails(response.data.case))
            .catch(() => triggerAlert('Failed to load case details'));

        axios.get(`${apiUrl}/evidence/${caseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setEvidenceList(response.data.evidence))
            .catch(() => triggerAlert('No evidence is available'));
    }, [caseId]);

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleUpload = async () => {
        if (!file) {
            triggerAlert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_reshmasam');
        formData.append('folder', 'Evidence');

        try {
            // Upload to Cloudinary
            const uploadResponse = await axios.post('https://api.cloudinary.com/v1_1/dmvpuoovp/upload', formData);
            // console.log('Cloudinary response:', uploadResponse.data);

            const fileUrl = uploadResponse.data.secure_url;
            // console.log('Sending file URL to backend:', fileUrl);

            if (!fileUrl) {
                triggerAlert('Cloudinary upload failed');
                return;
            }


            // Send Cloudinary URL to your backend
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${apiUrl}/evidence/upload/${caseId}`,
                {
                    filePath: fileUrl,
                    description: description,
                    evidenceType: 'image'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // console.log('Backend response:', response.data);
            setEvidenceList([...evidenceList, response.data.evidence]);
            setFile(null);
            setDescription('');
            triggerAlert('Evidence uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error.response?.data || error);
            triggerAlert('Failed to upload evidence');
        }
    };


    const handleDeleteEvidence = async (evidenceId) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Are you sure you want to delete this evidence?')) return;

        try {
            await axios.delete(`${apiUrl}/evidence/${evidenceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvidenceList(evidenceList.filter((evidence) => evidence._id !== evidenceId));
            triggerAlert('Evidence deleted successfully');
        } catch (error) {
            triggerAlert('Failed to delete evidence');
        }
    };

    if (!caseDetails) return <div>Loading case details...</div>;

    return (
        <div className="position-relative">
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>

            <Container className="d-flex flex-column align-items-center p-4 bg-white min-vh-100 text-black">
                {caseDetails && (
                    <Card className="mb-4 w-100" style={{ maxWidth: '800px', backgroundColor: '#d7d5cd', borderRadius: '10px' }}>
                        <Card.Body>
                            <h4 className="text-center mb-3">{caseDetails.casetitle}</h4>
                            <p><strong>Category:</strong> {caseDetails.category}</p>
                            <p><strong>Specialization:</strong> {caseDetails.specialization}</p>
                            <p><strong>Client Name:</strong> {caseDetails.clientname}</p>
                            <p><strong>Description:</strong> {caseDetails.caseDescription}</p>
                            <Button variant="dark" onClick={() => navigate(`/updateCase/${caseId}`)}>Update Case</Button>
                        </Card.Body>
                    </Card>
                )}

                <Card className="mb-4 w-100" style={{ maxWidth: '800px', backgroundColor: '#d7d5cd', borderRadius: '10px' }}>
                    <Card.Body>
                        <h5 className="text-center mb-3">Upload Evidence</h5>
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter description..."
                                />
                            </Form.Group>
                            <Button variant="dark" onClick={handleUpload}>Upload</Button>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="w-100" style={{ maxWidth: '800px', backgroundColor: '#d7d5cd', borderRadius: '10px' }}>
                    <Card.Body>
                        <h5 className="text-center mb-4">Evidence List</h5>
                        {evidenceList.length === 0 ? (
                            <p>No evidence available.</p>
                        ) : (
                            <Row className="g-3">
                                {evidenceList.map((evidence) => (
                                    <Col key={evidence._id} md={6}>
                                        <Card className="p-2 bg-secondary text-white">
                                            <Card.Img src={evidence.filePath} alt={evidence.description} style={{ width: '100%', height: 'auto' }} />
                                            <Card.Text>{evidence.description}</Card.Text>
                                            <Button variant="danger" onClick={() => handleDeleteEvidence(evidence._id)} className="mt-2">Delete</Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default CaseProfile;
