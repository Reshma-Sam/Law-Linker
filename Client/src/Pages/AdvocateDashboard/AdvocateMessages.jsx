import React, { useEffect, useState } from "react";
import axios from "axios";

const AdvocateMessages = ({ advocateEmail }) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [replies, setReplies] = useState({}); // Stores reply messages for each client

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}/advocate/messages/${advocateEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMessages(response.data.messages);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching messages");
                setLoading(false);
            }
        };

        fetchMessages();
    }, [advocateEmail]);

    const handleReplyChange = (clientEmail, value) => {
        setReplies({ ...replies, [clientEmail]: value });
    };

    const sendReply = async (clientEmail) => {
        if (!replies[clientEmail]) return alert("Please enter a reply message.");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${apiUrl}/advocate/reply`,
                {
                    advocateEmail,
                    clientEmail,
                    replyMessage: replies[clientEmail],
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Reply sent successfully!");
            setReplies({ ...replies, [clientEmail]: "" }); // Clear input field
        } catch (error) {
            alert(error.response?.data?.message || "Error sending reply");
        }
    };

    return (
        <div>
            <h3>Messages for {advocateEmail}</h3>
            {loading && <p>Loading messages...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {messages.map((msg) => (
                    <li key={msg._id}>
                        <strong>From:</strong> {msg.clientname} <br />
                        <strong>Email:</strong> {msg.clientEmail} <br />
                        <strong>Message:</strong> {msg.message} <br />
                        <strong>Time:</strong> {new Date(msg.createdAt).toLocaleString()} <br />
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdvocateMessages;
