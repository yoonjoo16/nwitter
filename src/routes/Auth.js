import React, {useState} from "react";
import { authService } from "../fbase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value)
        } else if(name ==="password"){
            setPassword(value)
        }
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
        let data;
        if(newAccount) {
            //create account
            data = await authService.createUserWithEmailAndPassword(email, password)
            //because this returns a promise, so we need to use async/await.
        }else{
            //login
            data =await authService.signInWithEmailAndPassword(email, password);
        }
            console.log(data);
    } catch (e) {
        setError(e.message)
    }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);
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
        <input type="submit" value={newAccount ? "Create account" : "log in"} />
        {error}
    </form>
    <span onClick = {toggleAccount}>{newAccount ? "Sign in" : "Create account"} </span>
    <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
    </div>

    </div>);
}

export default Auth;