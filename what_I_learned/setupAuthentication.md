fbase.js before: 
```
import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
  };

export firebase.initializeApp(firebaseConfig);

```

Now we want to use the functions for authentication, so we import it nad export the `firebase.auth()`.

```
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
  };

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
```

After changing this, fbase.js will export `authService`. 
Therefore, we change App.js so that it will use this authService.

```
import React, {useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return <AppRouter  isLoggedIn={isLoggedIn}/>;
}

export default App;
```
Now the useState makes initial state with `authService.currentUser`.
This will check the currentUser, and if there is no user it will show the login page.

We add a log-in form in Auth.js, the login-page.

```
import React, {useState} from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value)
        } else if(name ==="password"){
            setPassword(value)
        }
    }
    const onSubmit = (event) => {
        event.preventDefault();
    }
    return (
    <div>
    <form onSubmit = {onSubmit}>
        <input 
            name = "email"
            type="text" 
            placeholder ="Email" 
            required 
            value={email}
            onChange ={onChange}/>
        <input 
            name="password"
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={onChange}/>
        <input type="submit" value="Log in" />
    </form>
    <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
    </div>

    </div>);
}

export default Auth;
```

Here, we make two states, email and password, using hook. 
And then, we make a function for onChange, and one for onSubmit. The reason we write `event.preventDefault()` is to prevent refresing the page when we click onSubmit. 

The methods for login can be chosen here: https://console.firebase.google.com/u/0/project/nwitter-6f915/authentication/providers

To set email-login, we follow the instruction: https://firebase.google.com/docs/reference/js/firebase.auth.EmailAuthProvider

We have already imported authService, so just add `authService.createUserWithEmailAndPassword(email, password)` or `authService.signInWithEmailAndPassword(email, password);` to create or sign in. This is a 'promise', therefore we need to write async/await as well. 

This will happen when we submit the form, so let's change onSubmit. 
```
const onSubmit = async(event) => {
        event.preventDefault();
        try {
        let data;
        if(newAccount) {
            //create account
            await authService.createUserWithEmailAndPassword(email, password)
            //because this returns a promise, so we need to use async/await.
        }else{
            //login
            await authService.signInWithEmailAndPassword(email, password);
        }
    } catch (e) {
        console.log(e.message)
    }
}
```

Some people will want to log in, some people will want to create new account.
To change the mode, we can add new state, 'newAccount', which shows the mode. Using setNewAccount, we can toggle the mode.

```
const [newAccount, setNewAccount] = useState(true);
...
const toggleAccount = () => setNewAccount((prev) => !prev);
```

Lastly, if we get an error, for example there is already an account with same email address, or wrong password, we want to know/show the error message. So it is good to save the error message and show. We use the useState again.

```
const [error, setError] = useState("");
...
const onSubmit = async(event) => {
       ...
    } catch (e) {
        setError(e.message)
    }
}

```
And then we can `{error}` somewhere in html so that the error message is shown. 


App.js needs to be changed because it probably takes some time to bring the user information. 

```
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //add an observer detecting user
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  return (
    <>
    {init ? <AppRouter  isLoggedIn={isLoggedIn}/> : "Initializing..."}    
    </>
  );
}

export default App;
```

First, we create a init-state. After rendering, useEffect executes onAuthStateChanged (https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged). This is kind of 'observer', watching if someone is logging in/out. After detecting user/no-user, it changes the state 'isLoggedIn', and change even init to true. It means, init will be false until onAuthSateChange is done, and the router will be called after init becomes true. 