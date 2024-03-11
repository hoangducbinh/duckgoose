// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfo5oMI_OxRWDbbcpzv3Pe735XZHK0qFY",
  authDomain: "fir-auth-4e4cd.firebaseapp.com",
  databaseURL: "https://fir-auth-4e4cd-default-rtdb.firebaseio.com",
  projectId: "fir-auth-4e4cd",
  storageBucket: "fir-auth-4e4cd.appspot.com",
  messagingSenderId: "6104495973",
  appId: "1:6104495973:web:3cf47865d9f277d3b1138c",
  measurementId: "G-F9FYSCP7SS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
