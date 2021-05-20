After making a React project, install firebase writing
```
npm install --save firebase
```

Make a .env file and add the information there. 
```
REACT_APP_API_KEY =
REACT_APP_AUTH_DOMAIN =
REACT_APP_PROJECT_ID =
REACT_APP_STORAGE_BUCKET =
REACT_APP_MESSAGIN_ID =
REACT_APP_APP_ID =
```

Make a file in src `fbase.js`, and copy and paste the scripts for Firebase configuration. 
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

export default  firebase.initializeApp(firebaseConfig);
```

In index.js, add
```
import fbase from "fbase";
```

and add '.env' in gitignore.