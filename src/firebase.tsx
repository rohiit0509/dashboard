// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBA1Kq_N4PuZbi8frm7CtI3oPar4C6SX4w",
  authDomain: "rajpalrealtors-l.firebaseapp.com",
  projectId: "rajpalrealtors-l",
  storageBucket: "rajpalrealtors-l.appspot.com",
  messagingSenderId: "433514283725",
  appId: "1:433514283725:web:9951b76727d507ddb05f84",
  measurementId: "G-2WX0EG1EER"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);