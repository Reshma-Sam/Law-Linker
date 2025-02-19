import React from "react"

const CustomAlert = ({ header, message, onClose }) => {
    if (!message) return null;

    return (
        <div className="custom-alert">
            <div className="alert-header">Alert
                <span>{header}</span>
                <button className="alert-button" onClick={onClose}>Ok</button>
            </div>
            <div className="alert-message ">
                {message}
            </div>
        </div>
    );
};

export default CustomAlert;
