let Article = require('../models/articles.models');
let User = require('../models/users.models');
const schedule = require('node-schedule');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');
// const uploadOnCloudinary = require("../utils/cloudinaryConfig");

const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const { isDate } = require('validator');
// import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log(localFilePath);
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    console.log("file uploaded on cloudinary", response.url);
    return response.url;

}

const jobInstances = new Map();

const getAllArticle = async function (req, res) {
    try {
        const allEntries = await Article.find();
        res.status(200).json({ allEntries })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// const updateStatus = async function(articleId) {
//     await Article.findByIdAndUpdate(articleId, { status: "Published" }, { new: true });
// }

function reduceOneHour(date) {
    // Create a new Date object to avoid mutating the original one
    const newDate = new Date(date);

    // Subtract one hour from the new Date object
    newDate.setHours(newDate.getHours() - 1);

    // Return the new Date object
    return newDate;
}

const emailTemplate = (firstName, articleTitle, slug, id, publishDate, publishTime) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    /* Styling for the email template */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #f9f9f9;
    }

    .heading {
      text-align: center;
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }

    .content {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }

    .link {
      color: #007bff;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
      margin-top: 20px;
    }
  </style>
</head>

<body>

  <div class="container">
    <h1 class="heading">Rapid Page Builder</h1>
    <div class="content">
      <p>Good morning, ${firstName}!</p>
      <p>Blog Page Title: <strong>${articleTitle}</strong></p>
      <p>Date to be Published: <strong>${publishDate},${publishTime}</strong></p>
      <p>Access the blog <a class="link" href="http://127.0.0.1:3000/preview/${slug}/${id}">here</a>.</p>
    </div>
    <p class="footer">501 Satyamev Eminence, Ahmedabad, GJ 12345</p>
  </div>

</body>

</html>
`;

function isDateTimePassed(dateTime) {
    // Get the current date and time
    const currentDateTime = new Date();

    // Compare the given dateTime with the currentDateTime
    return dateTime < currentDateTime;
}

const setArticle = async function (req, res) {
    let attachments = "";
    const { title, subTitle, content, slug, showAuthor, status, publishDate, publishTime, createdBy, attachmentLink } = req.body;

    try {
        attachments = attachmentLink;
        if (req.file?.path) {
            const attachmentLocalPath = req.file?.path;
            const myFile = await uploadOnCloudinary(attachmentLocalPath);
            attachments = myFile;
        }

        const newArticle = new Article({ createdBy: req.user._id, title, subTitle, content, slug, status, showAuthor, authorName: req.user.firstName, publishDate, publishTime, accessSlug: false, attachments });
        // const newArticle = new Article({ createdBy: req.user._id, title, subTitle, content, slug, status, showAuthor, authorName: req.user.firstName, publishDate, publishTime, accessSlug: false });
        // await newArticle.save();



        if (publishDate != "") {
            const user = await User.findById(req.user._id);
            const dateTimeString = publishDate + 'T' + publishTime;
            const date = new Date(dateTimeString);
            // console.log(date);
            if (isDateTimePassed(date)) {
                throw Error("Cannot allow a previous date");
            }

            const scheduledJob = schedule.scheduleJob(date, async function () {
                newArticle.accessSlug = true;
                newArticle.status = "Published";
                await newArticle.save();
            });
            jobInstances.set(scheduledJob.name, scheduledJob);
            newArticle.publishTaskReference = scheduledJob.name;

            const newDate = new Date();
            // console.log(newDate);
            const timeDifferenceMs = Math.abs(date - newDate);
            const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
            console.log(timeDifferenceHours);
            // console.log(timeDifferenceHours);
            if (timeDifferenceHours < 1) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'yashd026@gmail.com',
                        pass: 'fthi bmzv krls cbcp'
                        //Paste your generated 16-digit password here as your password
                        //To generate the password make sure to follow these steps,
                        //Turn on 2-Step Verification in your Gmail
                        //Go to your Google Account.
                        //Select Security.
                        //Under "Signing in to Google," select 2-Step Verification.
                        //At the bottom of the page, select App passwords.
                        //Enter a name that helps you remember where you’ll use the app password.
                        //Select Generate.
                        //To enter the app password, follow the instructions on your screen. The app password is the 16-character code that generates on your device.
                        //Select Done.
                    }
                });
                transporter.use('compile', inLineCss());

                const mailOptions = {
                    from: 'yashd026@gmail.com',
                    to: user.email,
                    subject: 'Rapid Builder blog update',
                    // text: 'your email body content here',
                    html: emailTemplate(user.firstName, newArticle.title, newArticle.slug, newArticle._id, newArticle.publishDate, newArticle.publishTime),
                    // attachments: [
                    //   {
                    //     filename: 'image.png',
                    //     path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png>'
                    //   }
                    // ]
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            else {
                const mailScheduledJob = schedule.scheduleJob(reduceOneHour(date), function () {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'yashd026@gmail.com',
                            pass: 'fthi bmzv krls cbcp'
                            //Paste your generated 16-digit password here as your password
                            //To generate the password make sure to follow these steps,
                            //Turn on 2-Step Verification in your Gmail
                            //Go to your Google Account.
                            //Select Security.
                            //Under "Signing in to Google," select 2-Step Verification.
                            //At the bottom of the page, select App passwords.
                            //Enter a name that helps you remember where you’ll use the app password.
                            //Select Generate.
                            //To enter the app password, follow the instructions on your screen. The app password is the 16-character code that generates on your device.
                            //Select Done.
                        }
                    });
                    transporter.use('compile', inLineCss());

                    const mailOptions = {
                        from: 'yashd026@gmail.com',
                        to: user.email,
                        subject: 'Rapid Builder blog update',
                        html: emailTemplate(user.firstName, newArticle.title, newArticle.slug, newArticle._id, newArticle.publishDate, newArticle.publishTime),
                        // attachments: [
                        //   {
                        //     filename: 'image.png',
                        //     path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png>'
                        //   }
                        // ]
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
                jobInstances.set(mailScheduledJob.name, mailScheduledJob);
                newArticle.mailTaskReference = mailScheduledJob.name;
                // console.log(mailScheduledJob);
                // newArticle.mailTaskReference = mailScheduledJob.name;
            }

            // newArticle.publishTaskReference = scheduledJob.name;
            // console.log(scheduledJob);
            // await newArticle.save();
        }

        // res.json({ article: newArticle });
        // console.log(date);

        // newArticle.publishTaskReference = scheduledJob.name;
        // console.log(scheduledJob);
        await newArticle.save();
        res.json({ article: newArticle });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getArticle = async function (req, res) {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);

        if (article.status == "Published") {
            res.status(200).json(article);
        }
        else {
            res.status(500).json({ error: "slug access not allowed" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const fetchArticle = async function (req, res) {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteArticle = async function (req, res) {
    const id = req.body.id;
    try {
        const article = await Article.findById(id);
        const mailRef = article.mailTaskReference;
        const taskRef = article.publishTaskReference;

        if (jobInstances.get(mailRef)) {
            jobInstances.get(mailRef).cancel();
            jobInstances.delete(mailRef);
        }
        if (jobInstances.get(taskRef)) {
            jobInstances.get(taskRef).cancel();
            jobInstances.delete(taskRef);
        }

        const deletedArticle = await Article.findByIdAndDelete(id);

        res.json({ deletedArticle });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editArticle = async function (req, res) {
    let attachments = "";
    const { id, title, subTitle, content, slug, status, showAuthor, publishDate, publishTime, attachmentLink } = req.body;

    try {
        attachments = attachmentLink;
        if (req.file?.path) {
            const attachmentLocalPath = req.file?.path;
            const myFile = await uploadOnCloudinary(attachmentLocalPath);
            attachments = myFile;
        }
        const newArticle = await Article.findById(id);
        newArticle.attachments = attachments;
        await newArticle.save();

        if (publishDate != "") {
            const user = await User.findById(req.user._id);
            const dateTimeString = publishDate + 'T' + publishTime;
            const date = new Date(dateTimeString);
            // console.log(date);
            if (isDateTimePassed(date)) {
                throw Error("Cannot allow a previous date");
            }

            const mailRef = newArticle.mailTaskReference;
            const taskRef = newArticle.publishTaskReference;

            if (jobInstances.get(mailRef)) {
                jobInstances.get(mailRef).cancel();
                jobInstances.delete(mailRef);
            }
            if (jobInstances.get(taskRef)) {
                jobInstances.get(taskRef).cancel();
                jobInstances.delete(taskRef);
            }

            const scheduledJob = schedule.scheduleJob(date, async function () {
                newArticle.accessSlug = true;
                newArticle.status = "Published";
                await newArticle.save();
            });
            jobInstances.set(scheduledJob.name, scheduledJob);
            newArticle.publishTaskReference = scheduledJob.name;

            const newDate = new Date();
            // console.log(newDate);
            const timeDifferenceMs = Math.abs(date - newDate);
            const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
            // console.log(timeDifferenceHours);
            if (timeDifferenceHours < 1) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'yashd026@gmail.com',
                        pass: 'fthi bmzv krls cbcp'
                        //Paste your generated 16-digit password here as your password
                        //To generate the password make sure to follow these steps,
                        //Turn on 2-Step Verification in your Gmail
                        //Go to your Google Account.
                        //Select Security.
                        //Under "Signing in to Google," select 2-Step Verification.
                        //At the bottom of the page, select App passwords.
                        //Enter a name that helps you remember where you’ll use the app password.
                        //Select Generate.
                        //To enter the app password, follow the instructions on your screen. The app password is the 16-character code that generates on your device.
                        //Select Done.
                    }
                });
                transporter.use('compile', inLineCss());

                const mailOptions = {
                    from: 'yashd026@gmail.com',
                    to: user.email,
                    subject: 'Rapid Builder blog update',
                    html: emailTemplate(user.firstName, newArticle.title, newArticle.slug, newArticle._id, newArticle.publishDate, newArticle.publishTime),
                    // attachments: [
                    //   {
                    //     filename: 'image.png',
                    //     path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png>'
                    //   }
                    // ]
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            else {
                const mailScheduledJob = schedule.scheduleJob(reduceOneHour(date), function () {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'yashd026@gmail.com',
                            pass: 'fthi bmzv krls cbcp'
                            //Paste your generated 16-digit password here as your password
                            //To generate the password make sure to follow these steps,
                            //Turn on 2-Step Verification in your Gmail
                            //Go to your Google Account.
                            //Select Security.
                            //Under "Signing in to Google," select 2-Step Verification.
                            //At the bottom of the page, select App passwords.
                            //Enter a name that helps you remember where you’ll use the app password.
                            //Select Generate.
                            //To enter the app password, follow the instructions on your screen. The app password is the 16-character code that generates on your device.
                            //Select Done.
                        }
                    });
                    transporter.use('compile', inLineCss());

                    const mailOptions = {
                        from: 'yashd026@gmail.com',
                        to: user.email,
                        subject: 'Rapid Builder blog update',
                        html: emailTemplate(user.firstName, newArticle.title, newArticle.slug, newArticle._id, newArticle.publishDate, newArticle.publishTime),
                        // attachments: [
                        //   {
                        //     filename: 'image.png',
                        //     path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png>'
                        //   }
                        // ]
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
                jobInstances.set(mailScheduledJob.name, mailScheduledJob);
                newArticle.mailTaskReference = mailScheduledJob.name;
                // console.log(mailScheduledJob);
                // newArticle.mailTaskReference = mailScheduledJob.name;
            }

            await newArticle.save();
            const updatedArticle = await Article.findByIdAndUpdate(id, { lastModifiedBy: req.user._id, title, subTitle, content, slug, showAuthor, publishDate, publishTime, accessSlug: false, status: status }, { new: true });
            res.json({ updatedArticle });

            // newArticle.publishTaskReference = scheduledJob.name;
            // console.log(scheduledJob);
            // await newArticle.save();
        }
        else {
            const updatedArticle = await Article.findByIdAndUpdate(id, { lastModifiedBy: req.user._id, title, subTitle, content, slug, showAuthor, accessSlug: false }, { new: true });
            res.json({ updatedArticle });
        }
        // const article = await Article.findById(id);
        // console.log(article.mailTaskReference);
        // console.log(schedule);
        // console.log(schedule.scheduledJobs[article.mailTaskReference]);

        // const task1 = schedule.scheduledJobs[article.mailTaskReference];
        // const task2 = schedule.scheduledJobs[article.publishTaskReference];

        // task1.cancel();
        // task2.cancel();

        // if (publishDate) {
        //     const dateTimeString = publishDate + 'T' + publishTime;
        //     const date = new Date(dateTimeString);
        //     const scheduledJob = schedule.scheduleJob(date, async function () {
        //         article.accessSlug = true;
        //         article.status = "Published";
        //         await article.save();
        //     });

        //     const newDate = reduceOneHour(date);
        //     const timeDifferenceMs = Math.abs(newDate - date);
        //     const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
        //     if (timeDifferenceHours < 1) {
        //         sendEmail();
        //     }
        //     else {
        //         const mailScheduledJob = schedule.scheduleJob(newDate, async function () {
        //             sendEmail();
        //         });
        //         article.mailTaskReference = mailScheduledJob.name;
        //     }

        //     article.publishTaskReference = scheduledJob.name;
        //     await article.save();
        // }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getAllArticle, setArticle, getArticle, deleteArticle, editArticle, fetchArticle }