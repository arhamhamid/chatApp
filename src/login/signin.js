import React, { useState } from "react";
import { auth , db, provider} from "../config";
import { Link, useNavigate } from "react-router-dom";
import {signInWithPopup,signInWithEmailAndPassword} from "firebase/auth";
import { getDoc, setDoc,doc } from "firebase/firestore";
import './signin.css'


export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'user',
          name: user.displayName,
        });
      }
  
      console.log(user.email);
      {user && navigate('/users  ')}
    } catch (error) {
      if(error.code === 'auth/invalid-email'){
        alert("invalid Email")
      }
      if (error.code === 'auth/invalid-login-credentials') {
        alert('No User Found');
      }
      console.error(error);
    }
  };

  const signinuser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user.email);
      if (user) {
          navigate('/users');
      }
  } catch (error) {
      if (error.code === 'auth/invalid-email') {
          alert("Invalid Email");
      } else if (error.code === 'auth/invalid-login-credentials') {
          alert('No User Found');
      }
      console.error(error);
  }
  };

  const checkUser = () => {
    console.log(auth?.currentUser?.email);
  };

  return (
    <div className="mainsignin">
    <div className="signinForm">
      <h1>Login</h1>
      <form>
        <div className="textField">
          <input value={email} required  type="email" name="email" onChange={(e) => {setEmail(e.target.value); }}/>
          <span></span>
          <label>Email</label>
        </div>
        <div className="textField">
          <input  required value={password}  type="password"  name="password" onChange={(e) => { setPassword(e.target.value);  }}  />
          <span></span>
          <label >password</label>
        </div>
        <button type="button" onClick={signinuser}>
          Login
        </button>
      </form>
      <br />
      <button className="googleBtn" onClick={signUpWithGoogle}>sign up with google</button>
      <br />
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
      {/* <button onClick={checkUser}>Check</button> */}
    </div>
    </div>
  );
};
