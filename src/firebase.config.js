import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrpykVFbHDMZ78oLWfQHnZI_hZqYwX4IU",
  authDomain: "myhome-8d306.firebaseapp.com",
  projectId: "myhome-8d306",
  storageBucket: "myhome-8d306.appspot.com",
  messagingSenderId: "735056747342",
  appId: "1:735056747342:web:c476619e71a645adbb5c1f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
