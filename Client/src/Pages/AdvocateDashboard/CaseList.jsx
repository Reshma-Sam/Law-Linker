import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CaseList = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [cases, setCases] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (!decoded.email || !decoded.usertype) {
                setError('Invalid token. Please log in again.');
                return;
            }

            axios.get(` ${apiUrl}/advocate/getCases`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.success) {
                    setCases(response.data.cases);
                } else {
                    setError(response.data.message);
                }
            })
            .catch(error => {
                setError(error.response?.data?.message || 'Failed to fetch cases');
            });
        } catch (error) {
            setError('Failed to decode token. Please log in again.');
        }
    }, []);

    const handleViewClick = (caseId) => {
        navigate(`/caseProfile/${caseId}`);
    };

    return (
        <div className="flex justify-center p-6 caseList min-h-screen">
            <div className="w-full max-w-3xl  gap-4 ">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {cases.map((caseItem) => (
                    <div key={caseItem._id} className="p-6 mb-6 case rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{caseItem.casetitle}</h3>
                        <p className="mb-2"><strong>Category:</strong> {caseItem.category}</p>
                        <p className="mb-2"><strong>Specialization:</strong> {caseItem.specialization}</p>
                        <p className="mb-2"><strong>Client:</strong> {caseItem.clientname}</p>
                        <p className="mb-4"><strong>Description:</strong> {caseItem.caseDescription}</p>
                        <button  onClick={() => handleViewClick(caseItem._id)} className="loginButton  px-4 py-2 rounded hover:bg-gray-400">View</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseList