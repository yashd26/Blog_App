import React from 'react';
import { useNavigate } from 'react-router-dom';

import "./topNav.css"

function TopNav() {
    const history = useNavigate();

    function addArticle() {
        history("/addArticle")
    }

    return (
        <div className='top-nav'>
            <svg className='top-nav-sign' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.14844 6.99844C3.14844 6.529 3.529 6.14844 3.99844 6.14844H19.9984C20.4679 6.14844 20.8484 6.529 20.8484 6.99844C20.8484 7.46788 20.4679 7.84844 19.9984 7.84844H3.99844C3.529 7.84844 3.14844 7.46788 3.14844 6.99844ZM3.14844 11.9984C3.14844 11.529 3.529 11.1484 3.99844 11.1484L13.9984 11.1484C14.4679 11.1484 14.8484 11.529 14.8484 11.9984C14.8484 12.4679 14.4679 12.8484 13.9984 12.8484L3.99844 12.8484C3.529 12.8484 3.14844 12.4679 3.14844 11.9984ZM3.99844 16.1484C3.529 16.1484 3.14844 16.529 3.14844 16.9984C3.14844 17.4679 3.529 17.8484 3.99844 17.8484H19.9984C20.4679 17.8484 20.8484 17.4679 20.8484 16.9984C20.8484 16.529 20.4679 16.1484 19.9984 16.1484H3.99844Z" fill="#201F37" />
            </svg>
            <div className='top-nav-content'>
                <h3>Pages</h3>
                <p>Create and Publish pages</p>
            </div>
            <button className='add-page' onClick={addArticle}>+ Add Page</button>
        </div>
    )
}

export default TopNav
