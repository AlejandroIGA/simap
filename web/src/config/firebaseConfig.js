// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDd43mRpE4_Nv7AZxplf-H95hp5Hl8e-bQ',
  authDomain: 'testesp-36e82.firebaseapp.com',
  projectId: 'testesp-36e82',
  storageBucket: 'testesp-36e82.appspot.com',
  messagingSenderId: '400085471216',
  appId: '1:400085471216:web:4e9ce06defadd524bfd735',
  measurementId: 'G-K87TG2LLF7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
