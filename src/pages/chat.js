import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, deleteDoc, doc,} from "firebase/firestore";
import { db, storage } from "../config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./chat.css";
import {FaFile, FaTrash} from 'react-icons/fa'

export const Chat = () => {
  const { currentUserUid, selectedUserUid, currentUserName, selectedUserName } = useAppContext();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const messageContainerRef = useRef(null); //ref for message 
  const fileInputRef = useRef(null); // ref for file input 

  const createChannelId = (userUid1, userUid2) => {
    const uids = [userUid1, userUid2].sort();
    return uids.join("-");
  };
  const channelId = createChannelId(currentUserUid, selectedUserUid);

  useEffect(() => {
    sessionStorage.setItem("channelId", channelId);

    const messagesRef = collection(db, "channels", channelId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(10000) );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = [];
      snapshot.forEach((doc) => {
        const message = doc.data();
        message.id = doc.id;
        messageData.push(message);
      });
      setMessages(messageData);

      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [channelId]);

  const sendMsg = () => {
    if (!msg && !selectedFile) return;

    let fileURL = null;

    if (selectedFile) {
      const storageRef = ref(storage, `chat_files/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // upload progress
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              fileURL = downloadURL;
              console.log("File available at", fileURL);

              // both text and file
              const messageData = {
                createdAt: serverTimestamp(),
                text: msg,
                senderId: currentUserUid,
                receiverId: selectedUserUid,
                Name: currentUserName,
                URL: fileURL,
              };

              addDoc(
                collection(db, "channels", channelId, "messages"), messageData)
                .then(() => {
                  console.log("Message added to Firestore");
                  setMsg("");
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                })
                .catch((error) => {
                  console.error("Error adding message to Firestore:", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    } else {
      const messageData = {
        createdAt: serverTimestamp(),
        text: msg,
        senderId: currentUserUid,
        receiverId: selectedUserUid,
        Name: currentUserName,
        URL: null,
      };

      addDoc(collection(db, "channels", channelId, "messages"), messageData)
        .then(() => {
          console.log("Message added to Firestore");
          setMsg("");
        })
        .catch((error) => {
          console.error("Error adding message to Firestore:", error);
        });
    }
  };
  const deleteMsg = async (message) => {
    try {
      const messageDocRef = doc( db, "channels", channelId, "messages", message.id);
      await deleteDoc(messageDocRef);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  const leaveChat = () => {
    navigate("/users");
  };

  return (
    <div className="mainChatDiv">
      <nav className="mainNav">
        <h1>
          <span>User logged in : </span> {currentUserName}
        </h1>
        <button onClick={leaveChat}>Leave Chat</button>
      </nav>
      <h1 className="selectedUser">{selectedUserName}</h1>

      <div ref={messageContainerRef} className="getMsgs">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === currentUserUid ? "sent" : "received"
            }`}
          >
            {message.text && <p>{message.text}</p>}
            {message.URL && (
              <img  className="chatImage"src={message.URL} alt="Received file" />
            )}
            <p>
              {message.createdAt
                ? new Date(message.createdAt.toMillis()).toLocaleString()
                : ""}
            </p>
            {message.senderId === currentUserUid && (
              <button className="delBtn" onClick={() => deleteMsg(message)}><FaTrash/></button>
            )}
          </div>
        ))}
      </div>
      <div className="inputField">
        <input ref={fileInputRef}  type="file"  id="fileInput" onChange={(e) => {  setSelectedFile(e.target.files[0]);  }}/>
        <label className="labelFile" htmlFor="fileInput">
          <FaFile className="icon"/>
        </label>
        <input  className="textInput"  type="text"  value={msg}  onChange={(e) => setMsg(e.target.value)} />
        <button className="sendMsgBtn" onClick={sendMsg}> Send </button>
      </div>
    </div>
  );
};
