import React, { useEffect, useState } from 'react';
import { register } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { checkPassword } from '../utils/password';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/'); // navigate to the private home area
        }
    }, []);

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setPassword2('');
        
    };

    const resetError = () => {
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError();
        // TODO: Check if the passwords the same
        if (password == password2) {
            // TODO: Give username, email, password and password2 to register
            const { error } = await register(username, email, password, password2);
            if (error) {
                // DODO: check for the different errors
                if ('username' in error) {
                    setUsernameError(error.username.toString());
                };
                if ('email' in error) {
                    setEmailError(error.email.toString());
                };
                if ('password' in error) {
                    setPasswordError(error.password.join('\n'));
                };
            } else {
                // TODO: navigate to the private home area
                navigate('/')
                resetForm();
            }
        };
    };

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <hr />
                <div>
                    <label htmlFor='username'><b>Username</b></label>
                    {/* TODO: set the value from this input to the username constants with the onChange function */}
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                    {/* TODO: Show a error message when the username exist. Set the style from the error to 'error-message' */}
                    {usernameError && <p className='error-message'>{usernameError}</p>}
                </div>
                <div>
                    <label htmlFor='email'><b>E-Mail</b></label>
                    {/* TODO: set the value from this input to the email constants with the onChange function */}
                    <input
                        type='text'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='E-Mail Address'
                        required
                    />
                    {/* TODO: Show a error message when the E-mail is wrong. Set the style from the error to 'error-message' */}
                    {emailError && <p className='error-message'>{emailError}</p>}
                </div>
                <div>
                    <label htmlFor='password'><b>Password</b></label>
                    {/* TODO: set the value from this input to the password constants with the onChange function */}
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='confirm-password'><b>Confirm Password</b></label>
                    {/* TODO: set the value from this input to the password2 constants with the onChange function */}
                    <input
                        type='password'
                        id='confirm-password'
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder='Confirm Password'
                        required
                    />
                    {/* TODO: Show a error message when password and password2 is not the same. Set the style from the error to 'error-message' */}
                    <p className='error-message'>
                        {/* {!checkPassword(password, password2) ? '' : ''} */}
                    </p>
                    {/* TODO: Show a error message when for the password errors. Set the style from the error to 'error-message' */}
                    {passwordError && <p>
                        {passwordError.split('\n').map((item, index) => (
                            <React.Fragment key={index}>
                                {item}
                                <br />
                            </React.Fragment>
                        ))}
                        </p>}
                </div>
                {/* TODO: set the style from the button to 'button' */}
                <button type='submit'>Register</button>
            </form>
        </section>
    );
}

export default Register;