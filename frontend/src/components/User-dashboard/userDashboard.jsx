import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ArticleList from "./articleList";
import "./userDashboard.css"

function UserDashboard() {
    const history = useNavigate();

    const [articles, setArticles] = useState([]);

    const filteredBlogs = articles.filter(blog => {
        return (
            blog.status === "Published"
        );
    });

    useEffect(() => {
        const cookieExists = checkCookie();

        if (!cookieExists) {
            history("/login");
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
            setArticles(data.allEntries);
        }
        else {
            console.log("entry fetch error");
        }
    }

    const checkCookie = () => {
        return document.cookie.includes('token');
    };

    return (
        <table className='record-table'>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>URL</th>
                    <th>Author</th>
                    <th>Time created</th>
                </tr>
            </thead>
            <tbody>
                {filteredBlogs.map(blog => (
                    <ArticleList blog={blog} />
                ))}
            </tbody>
        </table>
    )
}

export default UserDashboard