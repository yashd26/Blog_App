import React, { useContext } from 'react';
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';

import "./previewArticle.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PreviewArticle() {
    const { slugURL, id } = useParams();

    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [body, setBody] = useState('')
    const [slug, setSlug] = useState('')
    const [showAuthor, setShowAuthor] = useState(false)
    const [authorName, setAuthorName] = useState("")
    const [attachment, setAttachments] = useState("");

    useEffect(() => {
        if (id != "0") {
            fetchArticle();
        }
        else {
            const data = JSON.parse(localStorage.getItem("previewArticle"));

            setTitle(data.title);
            setSubtitle(data.subTitle);
            setBody(data.content);
            setSlug(data.slug);
            setShowAuthor(data.showAuthor);
            setAuthorName(data.authorName);
            setAttachments(data.attachments);
        }
    }, [])

    const fetchArticle = async () => {
        const response = await fetch(`http://localhost:5000/articles/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie}`
            }
        })

        const data = await response.json();
        if (!data.error) {
            setTitle(data.title);
            setSubtitle(data.subTitle);
            setBody(data.content);
            setSlug(data.slug);
            setShowAuthor(data.showAuthor);
            setAuthorName(data.authorName);
            setAttachments(data.attachments);
        }
        else {
            toast.error("cannot access slug before published");
        }
    }

    return (
        <div className="blog-preview">
            <h2 className="title">{title}</h2>
            <p className="author">By: {showAuthor ? authorName : ""}</p>
            {subtitle ? <h4 className="sub-title">{subtitle}</h4> : ""}
            <div className="body-content">{body}</div>
            {attachment? <div><a href={attachment}>File Link</a></div>: ""}
        </div>
    )
}

export default PreviewArticle