import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../config";
import { doc, setDoc } from "firebase/firestore";
import "./signup.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const signupuser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(  auth,  email,  pass);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const uid = user.uid;
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: email,
        role: "user",
        name: name,
      });
      console.log("User logged in");
      navigate("/users");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      }
    }
  };
  return (
    <div className="mainsignup">
    <div className="signupForm">
      <h1>Sign Up</h1>
      <div className="main">
        <div className="Field">
          <input  required  type="text" value={name}  onChange={(e) => {  setName(e.target.value);  }} />
          <span></span>
          <label>Full Name</label>
        </div>
        <div className="Field">
          <input required type="email" value={email}onChange={(e) => { setEmail(e.target.value);  }}  />
          <span></span>
          <label>Email</label>
        </div>
        <div className="Field">
          <input type="password" required  value={pass} onChange={(e) => { setPass(e.target.value); }}/>
          <span></span>
          <label>Password</label>
        </div>
        <button onClick={signupuser}>sign up</button>
        <br />
        <br />
      </div>
    </div> 
    </div>
  );
};
