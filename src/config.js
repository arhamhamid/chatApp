import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider,} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyf7ENzBIbhpLClwDcz0UdqQe70sCig84",
  authDomain: "chatapp-4120b.firebaseapp.com",
  projectId: "chatapp-4120b",
  storageBucket: "chatapp-4120b.appspot.com",
  messagingSenderId: "637282722684",
  appId: "1:637282722684:web:96b4bcff582a9ffc207af9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
