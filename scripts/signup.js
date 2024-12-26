//Angular Sense JS

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF4bk55gh3bYl3AtHHqdYBUbzoNYutz5s",
  authDomain: "angular-sense.firebaseapp.com",
  projectId: "angular-sense",
  storageBucket: "angular-sense.firebasestorage.app",
  messagingSenderId: "468631800361",
  appId: "1:468631800361:web:c67123975336937ed06a38"
};

const app = initializeApp(firebaseConfig);
const message = document.querySelector('.message-box');
const auth = getAuth(app);
const submitButton = document.querySelector('.submit');
const db = getFirestore(app);
const registerUser = async (firstName,secondName, email,password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

  sendEmailVerification(user)
        .then(() => {
          submitButton.textContent = 'Submited';
          submitButton.style.opacity = '1';
          message.style.display = 'flex';
          messageText.textContent = 'Verification email sent. Please check your inbox.';
        })
        .catch((error) => {
          message.style.backgroundColor = '#FF7043';
          message.style.display = 'flex';
          messageText.textContent = `Error sending verification email`;
          submitButton.textContent = 'Not Submited';
          submitButton.style.opacity = '1';
        });

    await setDoc(doc(db, "users", user.uid), {
      firstname: firstName,
      secondname :secondName,
      email: email,
    });
    console.log("User registered and data saved successfully!");
  } catch (error) {
    console.error("Error during registration:", error.message);
    warning.textContent = "User already exists.";
  }
};
 const firstName = document.getElementById('firstName');
 const secondName = document.getElementById('secondName');
 const email = document.getElementById('email');
 const password = document.getElementById('password');
 const confirmPassword = document.getElementById('confirmPassword');

 const warning = document.querySelector('.warning-text');
 
 submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    submitButton.textContent = 'Submiting...';
    submitButton.style.opacity = '0.8';
    if(password.value.trim() == confirmPassword.value.trim()){
    registerUser(firstName.value.trim(), secondName.value, email.value, password.value.trim());
    }
    else{
      warning.textContent = "Passwords doesn't match."
      warning.style.display = 'block';
        }
 });