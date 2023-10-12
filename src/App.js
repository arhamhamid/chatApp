import "./App.css";
import { Signin } from "./login/signin";
import { Signup } from "./login/signup";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Users } from "./pages/users";
import { Chat } from "./pages/chat";
import { useEffect, useState } from "react";
import {  onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";
import { AppProvider } from "./AppContext";

function App() {
  const [user, setUser] = useState(null)

useEffect(()=>{
  const ok = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user)
      setUser(user); 
    } else {
      setUser(null); 
    }
  });
  return () => {
    ok();
  };
}, []); 
 
return (
  <div className="App">
    <Router>
    <AppProvider>
      <Routes>
        {user ? (
          <>
            <Route path="/users" element={<Users />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/" element={<Navigate to="/users" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      </AppProvider>

    </Router>
  </div>
);
}

export default App;