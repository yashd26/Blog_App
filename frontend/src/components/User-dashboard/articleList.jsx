import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ArticleList from "./articleList";
import "./articleList.css"


function UserArticleList({blog}) {
    return (
        <tr className='record1'>
            <td>
                {blog.title}
            </td>
            <td>
                {blog.subTitle}
            </td>
            <td><Link to={`/${blog.slug}/${blog._id}`}>Link</Link></td>
            <td>{blog.showAuthor == true ? blog.authorName : ""}</td>
            <td>{blog.createdAt}</td>
        </tr>
    )
}

export default UserArticleList