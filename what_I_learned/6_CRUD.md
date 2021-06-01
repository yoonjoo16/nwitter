Made a file Nweet.js 
```
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';


const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure?");
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onChange = (event) => {
           const { target: { value },
        } = event;
        setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        })
        setEditing(false);
    }

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input value={newNweet} required onChange={onChange} />
                        <input type="submit" value="Nweet" />
                    </form>

                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Nweet</button>
                            <button onClick={toggleEditing}>Edit Nweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}


export default Nweet;
```
This takes two parameters: nweetObj and isOwner. isOwner shows if the tweet is written by the current user or not. If so, it shows the button so that the user can delete/edit the tweet. 

## update
Made two states: editing and newNweet. editing shows if it is edit-mode or not. toggleEditing is to toggle it. 

If we click edit, then toggleEditing changes the state and it goes to edit-mode. Then it shows a form to edit the tweet. newNweet will contain the new content, and onSubmit updates the tweet's text by `dbService.doc(`nweets/${nweetObj.id}`).update`. and then, exit the edit-mode. 

## delete
onDeleteClick shows the window for confirmation, and if the user chooses ok, it finds the tweet and delete. 

```
import React, { useState, useEffect } from "react";
import { dbService } from 'fbase';
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id
            }
            setNweets(prev => [nweetObject, ...prev]);
        });
    }
    useEffect(() => {
        getNweets();
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNweets(nweetArray);
        })
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        })
        setNweet("");
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }

    return (
              <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={nweet}
                    onChange={onChange}
                    placeholder="What's in your mind?"
                    maxLength={120} />
                <input
                    type="submit"
                    value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}
export default Home;
```

## Create
onSubmit: it adds new tweet with text, createdAt, and creatorId. We can get the user's id using 'userObj.uid'. userObj came from App.js, after login. 

## Read
useEffect executes getNweets that loads data from the database. It makes nweetObject adding id to the data (text, createAt, creatorId). Now the array 'nweets' is ready and we make Nweet using map. 

