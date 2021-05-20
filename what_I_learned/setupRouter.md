Make a 'components' folder in src and make Router.js there.
Put the other pages in routes folder.

Install 
```
npm i react-router-dom
```

Ok, first change App.js in components so that it calls router.

```
import React, {useState} from 'react';
import AppRouter from 'components/Router';
import fbase from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <AppRouter  isLoggedIn={isLoggedIn}/>;
}

export default App;
```

And my router looks like this:

```
import React from "react";
import {HashRouter as Router, Route, Switch }from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";

const AppRouter =  ({isLoggedIn}) => {    
    return (
        <Router>
        <Switch>
            {isLoggedIn ? (
            <>
            <Route exact path = "/">
                <Home />
            </Route>
            </>) : (<Route exact path = "/">
                <Auth />
                </Route>)}
        </Switch>
    </Router>
    )
}

export default AppRouter;
```

useState-hook is used here to check if the user is logged in or not. the default value is false, dvs 'not logged in'. 
This 'AppRouter' returns:
```
return (<Router><Switch> {isLoggIn ? show home : show login page} </Switch> </Router>)
```