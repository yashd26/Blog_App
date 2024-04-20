import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./login.css"

function Login() {
	const history = useNavigate();

	useEffect(() => {
		const cookieExists = checkCookie();
	
		if (cookieExists) {
		  history('/dashboard');
		}
	  }, []);

	  const checkCookie = () => {
		return document.cookie.includes('token');
	  };

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:5000/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.token) {
			document.cookie = `token=${data.token}`
			history('/')
		} else {
			toast.error(data.error);
		}
	}

	return (
		<div className='login-container'>
			<div className='logo'>
				<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g id="Xpro Sidebar logo">
						<g id="Group">
							<path id="Vector" d="M28.1581 11.2937C29.0585 12.121 26.2358 12.4617 23.2671 21.0758C19.8847 30.9066 21.6124 34.5323 23.2184 36.99C24.3621 38.742 19.3007 38.0363 18.3274 37.063C14.7503 33.5833 19.5197 28.9842 16.6483 27.9379C14.507 27.1349 16.8673 34.6296 15.1153 34.289C11.4896 33.559 10.3459 25.7965 10.5163 23.4362C10.7353 20.1998 12.0736 20.3215 13.266 18.8371C14.507 17.3284 14.945 15.3574 15.9183 13.6784C17.3053 11.2693 25.8708 9.20098 28.1581 11.2937ZM21.1987 17.5718C22.0504 16.1361 22.5371 14.6274 21.1257 16.2091C18.887 18.7154 14.7016 25.6262 18.011 25.1882C20.2984 24.8718 19.4467 20.5161 21.1987 17.5718Z" fill="#4F46E5" />
							<path id="Vector_2" d="M38.5035 23.6827C38.4305 26.846 26.0447 25.7024 29.3784 28.9387C32.2011 31.6641 34.8291 26.116 37.4571 26.408C39.0145 26.5784 38.4305 28.5494 38.1142 29.5957C36.7271 34.1705 31.9577 38.5748 27.164 38.5748C21.7133 38.5748 22.1513 27.2354 24.171 21.3953C26.7747 13.9005 29.5001 11.5158 31.1547 12.0999C34.7805 13.3409 38.4305 17.8913 38.0168 21.152C37.7248 23.488 26.9694 23.123 29.427 24.4127C31.3007 25.386 38.5278 22.685 38.5035 23.6827Z" fill="#4F46E5" />
						</g>
					</g>
				</svg>

				<div className='logo-heading'>Rapid Page Builder</div>
			</div>
			<div className='login-form'>
				<div className='form-heading'>Login</div>
				<form className='form-container' onSubmit={loginUser}>
					<div className='input-container'>
						<label for="email" className='label'>Email address</label>
						<input
							id="email"
							className='input'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							placeholder="Enter your email address" />
					</div>
					<div className='input-container'>
						<label for="pass" className='label'>Password</label>
						<input
							id="pass"
							className='input'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							placeholder="Enter Password"
						/>
					</div>

					<div>
					<input className="submit" type='submit' value="Login" />
					<a href='/signup' className='signup'>SignUp instead</a>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login