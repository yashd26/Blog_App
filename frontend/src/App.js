import { React, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'

import Login from "./components/Login/login";
import Register from "./components/SignUp/signUp";
import Dashboard from "./components/Dashboard/dashboard";
import AddArticle from "./components/Add-article/addArticle";
import PreviewArticle from "./components/Add-article/previewArticle"
import UserDashboard from "./components/User-dashboard/userDashboard"

function App() {
  // const [article, setArticle] = useState({})
  // function updateArticle(article) {
  //   setArticle(article);
  //   console.log(article);
  // }

  return (
    <div>
      <Routes>
        <Route exact path="" element={<UserDashboard />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Register />}></Route>
        <Route exact path="/dashboard" element={<Dashboard />}></Route>
        <Route exact path="/addArticle" element={<AddArticle />}></Route>
        <Route exact path="/:slugURL/:id" element={<PreviewArticle />}></Route>
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
