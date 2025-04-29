// Copyright (C) 2025 Sanuka Weerabaddana

import { useState, useEffect, useRef } from "react"
import "./Login.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from "firebase/auth";
import Logo from '/src/assets/bandlogo.png'
import Note from '/src/assets/Note.svg';
import Padlock from '/src/assets/Closed-Padlock.svg';


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) return navigate("/dashboard");
    });

  }, [])

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/dashboard")
        const user = userCredential.user;
        console.log(user.email + " logged in.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
      });

  }
  const emailRef = useRef(null)
  const passRef = useRef(null)

  return (
    <div className="login-full">
      
        <img id="logo" src={Logo} alt="Logo" />
        <h2 className="login-subtitle">Admin Portal</h2>
        <div className="login">
        <form className="login-form">

          <div onClick={() => { emailRef.current.focus() }} className="login-full-input">
            <label>Email</label>
            <div className="login-input-box">
              <img className="login-icon" src={Note} alt="" />
              <input
                ref={emailRef}
                type="email"
                className="login-form-input"
                id="email-address"
                autoComplete="username"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="login-full-input" onClick={() => { passRef.current.focus() }}>
            <label>Password</label>
            <div className="login-input-box">
              <img className="login-icon" src={Padlock} alt="" />
              <input
                ref={passRef}
                type="password"
                className="login-form-input"
                id="password"
                autoComplete="current-password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <br />
          <button className="submit-btn" onClick={onLogin} >
            Log&nbsp;in&nbsp;<span className="login-arrow">{">"}</span>
          </button>
        </form>
      </div>
    </div>
  )
}