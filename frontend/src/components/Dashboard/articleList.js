import React, { useState, useEffect } from 'react';
// import { Popover, Menu, MenuItem } from '@material-ui/core';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import "./articleList.css"
import AddArticle from "../Add-article/addArticle"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function BlogRecord({ title, url, modifiedAt, lastModifiedBy, createdBy, createdAt, status, id, updateArticle, showAuthor, authorName, publishDate, publishTime }) {
    const history = useNavigate();
    const [modifierName, setModifierName] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (status == "Published") {
            setIsPublished(true);
        }

        fetchUser();
    }, [])

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const fetchUser = async function () {
        if (lastModifiedBy) {
            const response2 = await fetch(`http://localhost:5000/users/${lastModifiedBy}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie}`
                }
            })
            const data2 = await response2.json();
            if (!data2.error) {
                setModifierName(data2.firstName);
            }
            else {
                console.log("user fetch error");
            }
        }
    }

    const editArticle = async function () {
        const response = await fetch(`http://localhost:5000/articles/articles/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie}`
            }
        })

        const data = await response.json();
        if (!data.error) {
            // history({
            //     pathname: '/addArticle',
            //     state: { prop1: 'value1', prop2: 'value2' }
            // });
            localStorage.setItem("article", JSON.stringify(data));
            history('/addArticle')
        }
        else {
            console.log("entry edit error");
        }
    }

    const deleteArticle = async function () {

        const response = await fetch('http://localhost:5000/articles', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie}`
            },
            body: JSON.stringify({
                id: id
            })
        })

        const data = await response.json();
        if (!data.error) {
            toast("success delete");
            updateArticle(id);
        }
        else {
            toast.error(data.error);
        }
    }

    return (
        <tr className='record'>
            <td>
                {title}
            </td>
            <td>
                <div className="menu-container">
                    <div className="menu-toggle" onClick={toggleMenu}>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                    {isOpen && (
                        <div className="options">
                            <div className="option" onClick={editArticle}>Edit</div>
                            <div className="option" onClick={deleteArticle}>Delete</div>
                        </div>
                    )}
                </div>
            </td>
            <td><Link to={`/${url}/${id}`}>{url}</Link></td>
            <td>{modifiedAt}</td>
            <td>{modifierName}</td>
            <td>{showAuthor == true ? authorName : ""}</td>
            <td>{createdAt}</td>
            <td>{status}</td>
            <td>{publishDate}</td>
            <td>{publishTime}</td>
        </tr>
    );
}

export default BlogRecord;
