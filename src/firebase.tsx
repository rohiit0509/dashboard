// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBmnn4DPA9pRA3Yx9O2pJVucCvd7HNqX_c",
  authDomain: "test-b7a2c.firebaseapp.com",
  projectId: "test-b7a2c",
  storageBucket: "test-b7a2c.appspot.com",
  messagingSenderId: "765742787890",
  appId: "1:765742787890:web:0815cb43f7db1ac86a3b2b",
  measurementId: "G-DHR4WQZY3T"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);