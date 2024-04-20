import React, { useContext } from 'react';
import { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom';

import "./addArticle.css"
import Navbar from "../Navbar/navbar"
import Editor from 'react-simple-wysiwyg';
import TopNav from './topNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useLocation } from 'react-router-dom';

function AddArticle() {
    const history = useNavigate();

    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [body, setBody] = useState('')
    const [slug, setSlug] = useState('')
    const [showAuthor, setShowAuthor] = useState(false)
    const [id, setId] = useState(0)
    const [authorName, setAuthorName] = useState("")
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [status, setStatus] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [attachments, setAttachments] = useState("");

    // const { state } = useLocation();

    useEffect(() => {
        // setStatus("Draft");
        // localStorage.removeItem("previewArticle");
        // const { prop1, prop2 } = state;
        // console.log(prop1);
        // console.log(data);
        const cookieExists = checkCookie();

        if (!cookieExists) {
            history('/login');
        }

        if (localStorage.getItem("article")) {
            const propsData = JSON.parse(localStorage.getItem("article"));
            setTitle(propsData.title);
            setSubtitle(propsData.subTitle);
            setBody(propsData.content);
            setSlug(propsData.slug);
            setShowAuthor(propsData.showAuthor);
            setId(propsData._id);
            setAuthorName(propsData.authorName);
            // setPublishDate(propsData.publishDate);
            // setPublishTime(propsData.publishTime);
            setCreatedBy(propsData.createdBy);
            setStatus(propsData.status);
            setAttachments(propsData.attachments);
        }
        else if(localStorage.getItem("previewArticle")) {
            const propsData = JSON.parse(localStorage.getItem("previewArticle"));
            setTitle(propsData.title);
            setSubtitle(propsData.subTitle);
            setBody(propsData.content);
            setSlug(propsData.slug);
            setShowAuthor(propsData.showAuthor);
            setId(propsData._id);
            setAuthorName(propsData.authorName);
            // setPublishDate(propsData.publishDate);
            // setPublishTime(propsData.publishTime);
            setCreatedBy(propsData.createdBy);
            setStatus(propsData.status);
            setAttachments(propsData.attachments);
        }
        // else if (props.data) {
        //     console.log(props.data);
        //     localStorage.setItem("article", JSON.stringify(props.data));
        //     setTitle(props.data.title);
        //     setSubtitle(props.data.subTitle);
        //     setBody(props.data.content);
        //     setSlug(props.data.slug);
        //     setShowAuthor(props.data.showAuthor)
        //     setId(props.data._id)
        // }
    }, []);

    const checkCookie = () => {
        return document.cookie.includes('token');
    };

    async function setDraftArticle() {
        if (!localStorage.getItem("article")) {
            console.log(file);
            let formData = new FormData();
            formData.append('title', title);
            formData.append('subTitle', subtitle);
            formData.append('content', body);
            formData.append('slug', slug);
            formData.append('showAuthor', showAuthor);
            formData.append('status', "Draft");
            formData.append('publishDate', "");
            formData.append('publishTime', "");
            formData.append('createdBy', "");
            formData.append('attachmentLink', attachments);

            // Add file data to FormData
            if (file) {
                formData.append('attachments', file);
            }

            // console.log(status);
            const response = await fetch('http://localhost:5000/articles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${document.cookie}`
                },
                body: formData,
            })

            const data = await response.json();
            if (!data.error) {
                toast("draft saved");
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                history('/dashboard');
            }
            else {
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                toast.error(data.error);
            }
        }
        else {
            let formData = new FormData();
            formData.append('id', id);
            formData.append('title', title);
            formData.append('subTitle', subtitle);
            formData.append('content', body);
            formData.append('slug', slug);
            formData.append('showAuthor', showAuthor);
            formData.append('status', "Draft");
            formData.append('publishDate', "");
            formData.append('publishTime', "");
            formData.append('createdBy', "");
            formData.append('attachmentLink', attachments);

            // Add file data to FormData
            if (file) {
                formData.append('attachments', file);
            }

            const response = await fetch('http://localhost:5000/articles', {
                method: 'PATCH',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie}`
                },
                body: formData,
            })

            const data = await response.json();
            if (!data.error) {
                toast("draft saved");
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                history('/dashboard');
            }
            else {
                toast.error(data.error);
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                console.log(data.error);
            }
        }
    }

    const checkHandler = () => {
        setShowAuthor(!showAuthor)
    }

    const cancelEditOrUpdate = () => {
        localStorage.removeItem("article");
        history("/dashboard");
    }

    const [isAllFieldUpdated, setIsAllFieldUpdated] = useState(false);
    useEffect(() => {
        if (title != '' && body != '' && slug != '') {
            setIsAllFieldUpdated(true);
        }
    }, [title, body, slug]);

    const handlePublish = () => {
        if (!title || !body || !slug) {
            toast.error("PLease fill all the required fields to publish")
            return false;
        }
        else {
            return true
        }
    }

    // const [date1, setDate1] = useState("");
    // const [time1, setTime1] = useState("");

    const updateDateTime = async () => {
        if (publishDate && publishTime) {
            // console.log(publishDate);
            await setScheduledArticle();
        }
    }

    // const update = (date2, time2) => {
    //     setDate1(date2);
    //     setTime1(time2);
    // }

    useEffect(() => {
        updateDateTime();
        // updateDateTime(date1, time1);
        // console.log(publishDate);
    }, [publishDate, publishTime])

    // const setSchedule = async () => {
    //     await setScheduledArticle();
    // }

    // useEffect(() => {
    //     // This code will run after `publishDate` and `publishTime` have been updated
    //     console.log(publishDate);
    //     console.log(publishTime);
    //     setSchedule();
    //     // setScheduledArticle(); // Assuming this function does something with the updated state
    // }, [publishDate, publishTime]);

    const setScheduledArticle = async () => {
        if (!localStorage.getItem("article")) {
            let formData = new FormData();
            formData.append('title', title);
            formData.append('subTitle', subtitle);
            formData.append('content', body);
            formData.append('slug', slug);
            formData.append('showAuthor', showAuthor);
            formData.append('status', "Scheduled");
            formData.append('publishDate', publishDate);
            formData.append('publishTime', publishTime);
            formData.append('createdBy', "");
            formData.append('attachmentLink', attachments);

            // Add file data to FormData
            if (file) {
                formData.append('attachments', file);
            }
            const response = await fetch('http://localhost:5000/articles', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie}`
                },
                body: formData,
            })

            const data = await response.json();
            if (!data.error) {
                toast("article scheduled");
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                history('/dashboard');
            }
            else {
                toast.error(data.error);
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                console.log(data.error);
            }
        }
        else {
            let formData = new FormData();
            formData.append('id', id);
            formData.append('title', title);
            formData.append('subTitle', subtitle);
            formData.append('content', body);
            formData.append('slug', slug);
            formData.append('showAuthor', showAuthor);
            formData.append('status', "Scheduled");
            formData.append('publishDate', publishDate);
            formData.append('publishTime', publishTime);
            formData.append('createdBy', "");
            formData.append('attachmentLink', attachments);

            // Add file data to FormData
            if (file) {
                formData.append('attachments', file);
            }

            const response = await fetch('http://localhost:5000/articles', {
                method: 'PATCH',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie}`
                },
                body: formData,
            })

            const data = await response.json();
            if (!data.error) {
                toast("article scheduled");
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                history('/dashboard');
            }
            else {
                toast.error(data.error);
                localStorage.removeItem("article");
                localStorage.removeItem("previewArticle");
                console.log(data.error);
            }
        }
    }

    const handlePreview = () => {
        if (!title || !body || !slug) {
            toast.error("PLease fill all the required fields to preview")
            return false;
        }
        else {
            const obj = {};
            obj["title"] = title;
            obj["subTitle"] = subtitle;
            obj["content"] = body;
            obj["showAuthor"] = showAuthor;
            obj["authorName"] = authorName;
            obj["slug"] = slug;
            obj["attachments"] = attachments;

            localStorage.setItem("previewArticle", JSON.stringify(obj));
            history(`/${slug}/0`)
        }
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    }

    return (
        <div className='add-article-container'>
            <Navbar />
            <TopNav setDraft={setDraftArticle} cancelEditOrUpdate={cancelEditOrUpdate} handlePublish={handlePublish} handlePreview={handlePreview} setScheduledArticle={setScheduledArticle} setPublishDate={setPublishDate} setPublishTime={setPublishTime} setStatus={setStatus} isAllFieldUpdated={isAllFieldUpdated} />

            <form encType='multipart/form-data'>
                <div className='blog-content'>
                    <div className='input-container'>
                        <label for="title" className='label'>Title</label>
                        <input className='input' id='title' type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        ></input>
                    </div>
                    <div className='input-container'>
                        <label for="subTitle" className='label'>Sub Text</label>
                        <input className='input' id='subTitle' type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}></input>
                    </div>
                    <div className='input-container'>
                        <label className='label'>Body</label>
                        <Editor containerProps={{ style: { width: '980px' } }}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <div className='input-container'>
                        <label for="file" className='label'>File:</label>
                        <input id="file" className="input" type='file' onChange={handleFileChange}></input>
                    </div>
                    <div className='input-container'>
                        {attachments ? <div><a href={attachments}>File Link</a></div> : ""}
                    </div>
                </div>
                <div className='blog-right-content'>
                    <div className='right-content-heading'>
                        Options
                    </div>
                    <div className='right-input-container'>
                        <label for="url" className='label'>URL*</label>
                        <input type="text" className='input' id='url'
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        ></input>
                    </div>
                    <div className='right-input-container'>
                        <label for="author" className='label'>Author</label>
                        <input type="text" className='input' id='author' value={authorName} readOnly></input>
                    </div>
                    <div className='right-checkbox-container'>
                        <input id="author" type='checkbox' className='checkbox'
                            checked={showAuthor}
                            onChange={checkHandler}
                        ></input>
                        <label className='check-label' for="author">Show Author</label>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddArticle