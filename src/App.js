
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);


function App() {

  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })


  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        console.log(displayName, email, photoURL);
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: ''
        }
        setUser(signOutUser);


      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }

  const handleSubmit = (event) => {
    console.log(user.email, user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = ' ';
          newUserInfo.success = true;
          setUser(newUserInfo);
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;

          newUserInfo.success = false;
          setUser(newUserInfo);
          // ..
        });
    }
    event.preventDefault()

  }

  const handleBlur = (event) => {
    console.log(event.target.name, event.target.value);

    // email and password validation method
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);


    }

    if (event.target.name === 'password') {
      const checkPasswordValid = event.target.value.length > 6;

      const checkPasswordNumber = /\d{1}/.test(event.target.value);
      isFieldValid = checkPasswordValid && checkPasswordNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);

    }
  }



  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our Authentication system</h1>
      {/* <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <p>password: {user.password}</p> */}

      <form onSubmit={handleSubmit}>
        <input type="text" onBlur={handleBlur} name="name" id="" placeholder="enter your name" />

        <br />
        <input type="email" onBlur={handleBlur} required name="email" id="" placeholder="enter your email" /> <br />
        <input type="password" onBlur={handleBlur} required name="password" placeholder="enter your password" id="" /> <br />
        <input type="submit" name="signup" value="Sign Up" />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{color:'green'}}>User Created successfully</p>
      }
    </div>
  );
}

export default App;
