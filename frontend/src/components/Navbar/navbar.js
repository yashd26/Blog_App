import React from 'react';
import { useNavigate } from 'react-router-dom';

import "./navbar.css"
import profileImage from "../media/profile-image.png";
import { Tooltip } from 'react-tooltip'

function Navbar() {
    const history = useNavigate();

    function logout() {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
        history('/login');
    }

    return (
        <div className='navigation'>
            <svg className="logo-svg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.6581 10.864C28.5585 11.6913 25.7358 12.032 22.7671 20.6461C19.3847 30.4769 21.1124 34.1026 22.7184 36.5603C23.8621 38.3123 18.8007 37.6067 17.8274 36.6333C14.2503 33.1536 19.0197 28.5545 16.1483 27.5082C14.007 26.7052 16.3673 34.1999 14.6153 33.8593C10.9896 33.1293 9.84592 25.3668 10.0163 23.0065C10.2353 19.7701 11.5736 19.8918 12.766 18.4074C14.007 16.8987 14.445 14.9277 15.4183 13.2487C16.8053 10.8397 25.3708 8.77129 27.6581 10.864ZM20.6987 17.1421C21.5504 15.7064 22.0371 14.1977 20.6257 15.7794C18.387 18.2857 14.2016 25.1965 17.511 24.7585C19.7984 24.4422 18.9467 20.0864 20.6987 17.1421Z" fill="#4F46E5" />
                <path d="M38.0035 23.253C37.9305 26.4163 25.5447 25.2727 28.8784 28.509C31.7011 31.2344 34.3291 25.6863 36.9571 25.9783C38.5145 26.1487 37.9305 28.1197 37.6142 29.166C36.2271 33.7408 31.4577 38.1452 26.664 38.1452C21.2133 38.1452 21.6513 26.8057 23.671 20.9656C26.2747 13.4709 29.0001 11.0862 30.6547 11.6702C34.2805 12.9112 37.9305 17.4616 37.5168 20.7223C37.2248 23.0583 26.4694 22.6933 28.927 23.983C30.8007 24.9563 38.0278 22.2553 38.0035 23.253Z" fill="#4F46E5" />
            </svg>
            <div className='nav-items'>
                <svg className="item1" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" fill="#EEF2FF" />
                    <path d="M18.5 12H12V20H18.5V12Z" stroke="#4F46E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M28 20H21.5V28H28V20Z" stroke="#4F46E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M28 12H21.5V17H28V12Z" stroke="#4F46E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M18.5 22.9998H12V27.9998H18.5V22.9998Z" stroke="#4F46E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg className="item2" width="40" height="1" viewBox="0 0 40 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="0.5" x2="40" y2="0.5" stroke="#E1E1E8" />
                </svg>
                <svg className="item3" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 28L27.2333 26.0271C27.4917 25.9751 27.75 25.7154 27.75 25.4039V12.4233C27.75 12.1637 27.5433 11.9561 27.2333 12.008L20 13.981" stroke="#6C6B80" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 13.9844L20 27.4842" stroke="#4F46E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981" fill="#6C6B80" />
                    <path d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981" stroke="#6C6B80" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.3203 15.9062L17.937 16.6331" stroke="#EEF2FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.3203 18.5L16.387 18.9153" stroke="#EEF2FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <svg className="item4" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.8672 20.8533V16.8C24.8672 14.1333 22.721 12 20.0382 12C17.3555 12 15.2093 14.1333 15.2093 16.8V20.8533M15.0484 21.0667L13.0631 24.8533C12.9022 25.12 13.0631 25.3333 13.3851 25.3333H26.6378C26.9598 25.3333 27.0671 25.12 26.9598 24.8533L24.9745 21.0667M22.1845 25.8665C22.1845 27.0398 21.2187 27.9998 20.0383 27.9998C18.8579 27.9998 17.8921 27.0398 17.8921 25.8665" stroke="#6C6B80" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <img onClick={logout} id="not-clickable" className="item5" src={profileImage}></img>
            <Tooltip anchorSelect="#not-clickable">
                <a>Logout</a>
            </Tooltip>
        </div>
    )
}

export default Navbar