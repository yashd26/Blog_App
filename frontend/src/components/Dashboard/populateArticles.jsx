import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import "./populateArticles.css"
import TopNav from "./topNav"
import ArticleList from "./articleList"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PopulateArticles({ updateBlog }) {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [uniqueAuthors, setUniqueAuthors] = useState([]);

    const filteredBlogs = articles.filter(blog => {
        return (
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === '' || blog.status === statusFilter) &&
            (authorFilter === '' || blog.authorName === authorFilter)
        );
    });

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        const uniqueAuthorSet = [];
        articles.map(blog => {
            if (!uniqueAuthorSet.includes(blog.authorName)) {
                uniqueAuthorSet.push(blog.authorName);
            }
        })

        setUniqueAuthors(uniqueAuthorSet);
    }, [articles]);

    function updateArticle(id) {
        const arrayOfObjects = articles.filter(obj => obj._id !== id);
        setArticles(arrayOfObjects);
        updateBlog(id)
    }

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

    return (
        <div className='articles-list'>
            <TopNav />

            <div className='filter-tab'>
                <input
                    className='search'
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <p className='records-length'>Number of Records: {filteredBlogs.length}</p>

                <select className="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                </select>

                <select className="author-filter" value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
                    <option value="">All Authors</option>
                    {uniqueAuthors.map((author, index) => (
                        <option key={index} value={author}>{author}</option>
                    ))}
                </select>

            </div>

            <table className='record-table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th></th>
                        <th>URL</th>
                        <th>Modified At</th>
                        <th>Last Modified By</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Publish Date</th>
                        <th>Publish Time</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBlogs.map(blog => (
                        <ArticleList
                            key={blog._id}
                            title={blog.title}
                            url={blog.slug}
                            modifiedAt={blog.updatedAt}
                            lastModifiedBy={blog.lastModifiedBy}
                            createdBy={blog.createdBy}
                            createdAt={blog.createdAt}
                            status={blog.status}
                            id={blog._id}
                            updateArticle={updateArticle}
                            showAuthor={blog.showAuthor}
                            authorName={blog.authorName}
                            publishDate={blog.publishDate}
                            publishTime={blog.publishTime}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PopulateArticles