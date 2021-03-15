
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
          photo: ''
        }
        setUser(signOutUser);


      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }

  const handleSubmit = () =>{

  }

  const handleBlur = (event) => {
    console.log(event.target.name ,event.target.value);
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
          <p>Welcome ,{user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our Authentication system</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" onBlur={handleBlur} required name="email" id="" placeholder="enter your email" /> <br />
        <input type="password" onBlur={handleBlur} required name="password" placeholder="enter your password" id="" /> <br />
        <input type="submit" name="signup" value="Sign Up" />
      </form>
    </div>
  );
}

export default App;
