Add `import "firebase/firestore";` and `export const dbService = firebase.firestore();` in fbase.js, and make a database in Firebase.

Right now, we have a form to 'tweet' in Home.js,
```
import React, {useState} from "react";
import {dbService} from 'fbase';

const Home =  () => {
    const [nweet, setNweet] = useState("");
    const onSubmit = async(event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now()
        })
        setNweet("");
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    }

    return (
        <div>
            <form onSubmit = {onSubmit}>
                <input 
                    type="text" 
                    value= {nweet} 
                    onChange={onChange}
                    placeholder="What's in your mind?" 
                    maxLength={120} />
                <input 
                type="submit" 
                value="Nweet" />
            </form>
        </div>
    )
}
export default Home;
```
According to https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference, `firebase.firestore.CollectionReference` has add(data) which returns a Promise. To use this, we make a state 'nweet', and when we write something in the form 'setNweet' will change the state. When we submit the form, we will add the 'nweet' in our collection "nweets" with time. Finally, we reset the state using setNweet so that the form shows a blank text field. 

To read data from the database, we can add another state, `nweets`. `get()` returns `QuerySnapshot` and it has `forEach` which calls for each document in the snapshot. Using this, we can print out document.data(), as below. 

```
const Home =  () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async() => {
        const dbNweets = await dbService.collection("nweets").get();
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id
            }
            setNweets(prev => [nweetObject, ...prev]);
        });
    }
    useEffect(()=>{
        getNweets();
    }, [])

    ...
    return (
        <div>
            <form onSubmit = {onSubmit}>
             ...
            </form>
            <div>
                {nweets.map(nweet => <div key = {nweet.id}>
                    <h4>{nweet.nweet}</h4>
                </div>)}
            </div>
        </div>
    )
}
```
Using forEach, we make nweetObject for every document from the database. The nweetObject contains nweet and time (as we added a tweet in the database before), and even id. setNweets will update the state, merging the new data with previous one. All of these things will happen after init-rendering, so we use useEffect.

