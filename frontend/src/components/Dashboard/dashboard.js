import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from "../Navbar/navbar"
import PopulateArticles from "./populateArticles"
import EmptyDashboard from "./emptyDashboard"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const history = useNavigate();

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        localStorage.removeItem("previewArticle");
        localStorage.removeItem("article");
        const cookieExists = checkCookie();

        if (!cookieExists) {
            history('/login');
        }

        fetchData();
    }, [])

    async function fetchData() {
        const response = await fetch('http://localhost:5000/articles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie}`
            }
        })

        const data = await response.json();
        if (!data.error) {
            console.log(data.allEntries);
            setArticles(data.allEntries)
        }
        else {
            console.log("entry fetch error");
        }
    }

    const checkCookie = () => {
        return document.cookie.includes('token');
    };

    function updateArticle(id) {
        const arrayOfObjects = articles.filter(obj => obj._id !== id);
        setArticles(arrayOfObjects);
    }

    return (
        <div className='dashboard-container'>
            <Navbar />
            {articles.length === 0 ? <EmptyDashboard /> : <PopulateArticles updateBlog={updateArticle} />}
        </div>
    )
}

export default Dashboard