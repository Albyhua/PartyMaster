import React, { useState } from 'react';
import '../../styles/Signup.css';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';

export function Signup(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addUser, { error }] = useMutation(ADD_USER);

    const handleFormSubmit = async(event)=>{
        event.preventDefault();
        try {
            const { data } = await addUser({
                variables: { email, name, password },
            });
            Auth.login(data.addUser.token)

       
            window.location.href="/dashboard";
         
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="landing-page">
            <main className="main-content">
                <div className="signup-container">
                    <form className="signup-form" 
                    onSubmit = {handleFormSubmit}
                    >
                        <div className="form-group">
                            <label htmlFor="username-signup" className="form-label">Username:</label>
                            <input type="text" id="username-signup" className="form-control" required 
                            placeholder="Enter New Username"
                            value = {name}
                            onChange={(event) =>setName(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-signup" className="form-label">Email Address</label>
                            <input type="email" id="email-signup" className="form-control" required 
                             placeholder="Enter Email Address"
                             value = {email}
                             onChange={(event) =>setEmail(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-signup" className="form-label">Password</label>
                            <input type="password" id="password-signup" className="form-control" required 
                             placeholder="Enter New Password"
                             value = {password}
                             onChange={(event) =>setPassword(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-signup" className="form-label">Confirm Password</label>
                            <input type="password" id="password-signup" className="form-control" required 
                             placeholder="Re-enter New Password"
                             value = {confirmPassword}
                             onChange={(event) =>setConfirmPassword(event.target.value)}
                            />
                        </div>
                       <button className="signup-button" type="submit">Sign Up</button>
                    </form>
                </div>
            </main>

            <footer className="landing-footer">
                <p>&copy; 2023 PartyMaster</p>
            </footer>
        </div >
    );
};

export default Signup;
