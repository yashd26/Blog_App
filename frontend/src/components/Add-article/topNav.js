import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./topNav.css"
import AddArticle from './addArticle';
import Modal from './modal';
// import Article from '../../../../backend/models/articles.models';

function TopNav(props) {
    const history = useNavigate();

    const [showPublish, setShowPublish] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [statusStyle, setStatusStyle] = useState("");

    const divStyle = {
        backgroundColor: statusStyle,
    };

    useEffect(() => {
        if (localStorage.getItem("article") && JSON.parse(localStorage.getItem("article")).status == "Published") {
            setIsEdit(true);
        }
        if (localStorage.getItem("article") && JSON.parse(localStorage.getItem("article")).status == "Scheduled") {
            setStatusStyle("orange");
        }
        else if (localStorage.getItem("article") && JSON.parse(localStorage.getItem("article")).status == "Draft") {
            setStatusStyle("blue")
        }
        else {
            setStatusStyle("green")
        }

        if (isEdit) {
            setShowPublish(true);
        }
        else {
            if (props.isAllFieldUpdated) {
                setShowPublish(false);
            }
        }

        // console.log(isEdit);
        // console.log(props.isAllFieldUpdated);
        // console.log(showPublish);
    });

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    function redirectDashboard() {
        localStorage.removeItem("article");
        history("/dashboard");
    }

    const previewArticle = async () => {
        // if (localStorage.getItem("article")) {
        //     history(`/preview/${JSON.parse(localStorage.getItem("article")).slug}/${JSON.parse(localStorage.getItem("article"))._id}`)
        // }
        props.handlePreview();
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='top-nav'>
            <svg className='top-nav-sign' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5995 5.3974C14.9314 5.72934 14.9314 6.26753 14.5995 6.59948L9.20052 11.9984L14.5995 17.3974C14.9314 17.7293 14.9314 18.2675 14.5995 18.5995C14.2675 18.9314 13.7293 18.9314 13.3974 18.5995L7.3974 12.5995C7.06545 12.2675 7.06545 11.7293 7.3974 11.3974L13.3974 5.3974C13.7293 5.06545 14.2675 5.06545 14.5995 5.3974Z" fill="#201F37" />
            </svg>

            <div className='top-nav-content'>
                <h2 onClick={redirectDashboard}>Home Page</h2>
            </div>
            <div className='top-nav-status' style={divStyle}>{localStorage.getItem("article") ? JSON.parse(localStorage.getItem("article")).status : ""}</div>
            <div className="menu-container">
                <div className="menu-toggle" onClick={toggleMenu}>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                {isOpen && (
                    <div className="options">
                        <div className="option" onClick={previewArticle}>Preview</div>
                    </div>
                )}
            </div>

            <button className='cancel' onClick={props.cancelEditOrUpdate}>Cancel</button>
            <button className='save' onClick={props.setDraft}>Save</button>
            <button className="publish" onClick={openModal} disabled={showPublish}>Publish</button>
            <Modal isOpen={isModalOpen} onClose={closeModal} setScheduledArticle={props.setScheduledArticle} setPublishDate={props.setPublishDate} setPublishTime={props.setPublishTime} setStatus={props.setStatus} />
        </div >
    )
}

export default TopNav
