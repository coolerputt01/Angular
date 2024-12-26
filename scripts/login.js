import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBF4bk55gh3bYl3AtHHqdYBUbzoNYutz5s",
  authDomain: "angular-sense.firebaseapp.com",
  projectId: "angular-sense",
  storageBucket: "angular-sense.firebasestorage.app",
  messagingSenderId: "468631800361",
  appId: "1:468631800361:web:c67123975336937ed06a38"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submission
const submitButton = document.querySelector('.submit');
const message = document.querySelector('.message-box');
const messageText = document.querySelector('.message-text');
const loadingSVG = document.querySelector('.inline');
const warningText = document.querySelector('.warning-text');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  loadingSVG.style.opacity = '1';
  submitButton.style.opacity = '0.7';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if(!email || !password){
    warningText.style.display = 'block'
  }
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        window.location.href = 'home.html';
        loadingSVG.style.opacity = '0';
        submitButton.style.opacity = '1';
      } else {
        loadingSVG.style.opacity = '0';
        submitButton.style.opacity = '1';
        message.style.backgroundColor = '#FF7043';
        message.style.display = 'flex';
        messageText.textContent = 'Please verify your email before logging in.';
        
      }
    }).catch((error) => {
      loadingSVG.style.opacity = '0';
      submitButton.style.opacity = '1';
      warningText.style.display = 'block';
      warningText.textContent = `Inaccurate Login details,check carefully.`;
    });
});