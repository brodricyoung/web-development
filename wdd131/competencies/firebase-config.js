
  const firebaseConfig = {
    apiKey: "AIzaSyD-IdbYMaSW12kMo3Q5dEvuybppjM4SrdI",
    authDomain: "competencies-11747.firebaseapp.com",
    projectId: "competencies-11747",
    storageBucket: "competencies-11747.firebasestorage.app",
    messagingSenderId: "441504359155",
    appId: "1:441504359155:web:a0884ddced7b0487b2cd86",
    measurementId: "G-H1GNS9N4MQ"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set up global variables for Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

