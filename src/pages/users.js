import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config";
import { collection, getDocs } from "firebase/firestore";
import { useAppContext } from "../AppContext"; 
import "./users.css";

export const Users = () => {
  const navigate = useNavigate();
  const { setCurrentUserUid, setSelectedUserUid , setCurrentUserName, setSelectedUserName} = useAppContext();
  const [users, setUsers] = useState([]);
  const [curUser, setCurUser] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      let userData = [];
      try {
        const querySnapshot = await getDocs(collection(db, "users"));

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userData.push(data);
        });

        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    const user = auth.currentUser;
    if (user) {
      setCurUser(user.displayName || "");
    }
  }, []);

  const logout = () => {
    signOut(auth);
    navigate("/");
  };

  const checkUser = () => {
    console.log(auth?.currentUser?.email);
  };
  
  const filteredUsers = users.filter(
    (user) => user.uid !== auth.currentUser?.uid
  );

  const chatUser = (userUid , userName) => {
    setSelectedUserUid(userUid);
    setCurrentUserUid(auth?.currentUser?.uid)
    setCurrentUserName(curUser)
    setSelectedUserName(userName)
    console.log(userUid);
    console.log(auth?.currentUser?.uid);
    console.log(curUser)
    console.log(userName)
    navigate('/chat')
  };

  return (
    <div className="mainUsersDiv">
      <nav className="mainNav">
        <h1> {curUser} is logged in</h1>
        <button className="logout" onClick={logout}>  Logout </button>
      </nav>
      <h1 className="userHeading">Users</h1>
      <ul>
        {filteredUsers.map((user) => (
          <div className="usersName" key={user.uid}>
            <button className="usersBtn" onClick={() => chatUser(user.uid , user.name)}>{user.name}</button>
          </div>
        ))}
      </ul>
    </div>
  );
};
