import React, { useState } from 'react';
import './modal.css'; // Import your CSS file for styling

const Modal = ({ isOpen, onClose, onSubmit, setScheduledArticle, setPublishDate, setPublishTime, setStatus }) => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const handleInputChange1 = (e) => {
        setInput1(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setInput2(e.target.value);
    };

    const handleClose = () => {
        setInput1('');
        setInput2('');
        onClose();
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        // updateDateTime(input1, input2);
        setPublishDate(input1);
        setPublishTime(input2);
        setStatus("Scheduled");
        onClose();
    }

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <form onSubmit={handleUpload}>
                    <label for="publishDate">Select a date:</label>
                    <input type="date" id="publishDate"
                        value={input1}
                        onChange={handleInputChange1}
                        required
                    ></input>

                    <label for="publishTime">Choose a time for your meeting:</label>
                    <input type="time" id="publishTime"
                        value={input2}
                        onChange={handleInputChange2}
                        required
                    ></input>

                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
    );
};

export default Modal;