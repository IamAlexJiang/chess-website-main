import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '@arco-design/web-react';

import FormInput from '../../../components/form-input/form-input.component.jsx';
import Button from '../../../components/button/button.component.jsx';

import {
    signInWithGooglePopup, 
    signInAuthUsersWithEmailAndPassword,
} from '../../../utils/firebase/firebase.utils.js';

import './sign-in-form.styles.scss';

const defaultFormFields = {
    email: '',
    password: '',
};

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithGooglePopup();
            
            Message.success({
                content: 'Signed in successfully! Redirecting to home page...',
                duration: 3000
            });
            
            // Navigate to home page after a brief delay to show success message
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Google sign in error:', error);
            Message.error({
                content: 'Failed to sign in with Google. Please try again.',
                duration: 4000
            });
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate email format
        if (!validateEmail(email)) {
            Message.error({
                content: 'Email not valid. Please enter a valid email address.',
                duration: 4000
            });
            return;
        }

        try {
            await signInAuthUsersWithEmailAndPassword(email, password);
            resetFormFields();
            
            Message.success({
                content: 'Signed in successfully! Redirecting to home page...',
                duration: 3000
            });
            
            // Navigate to home page after a brief delay to show success message
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Sign in error:', error);
            
            // Handle different Firebase error codes
            switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    // Firebase v9+ uses 'invalid-credential' for wrong password
                    // We can't distinguish between wrong password and user not found
                    // But we'll show wrong password message as it's more common
                    Message.error({
                        content: 'Wrong password. Please try again.',
                        duration: 4000
                    });
                    break;
                case 'auth/user-not-found':
                    Message.error({
                        content: 'User not found. Please check your email or sign up.',
                        duration: 4000
                    });
                    break;
                case 'auth/invalid-email':
                    Message.error({
                        content: 'Email not valid. Please enter a valid email address.',
                        duration: 4000
                    });
                    break;
                case 'auth/user-disabled':
                    Message.error({
                        content: 'This account has been disabled. Please contact support.',
                        duration: 4000
                    });
                    break;
                case 'auth/too-many-requests':
                    Message.error({
                        content: 'Too many failed attempts. Please try again later.',
                        duration: 4000
                    });
                    break;
                default:
                    // For auth/invalid-credential, we need to check if it's user not found
                    // by attempting to check if the email exists (but Firebase doesn't expose this)
                    // So we'll show a generic message
                    if (error.message && error.message.includes('user')) {
                        Message.error({
                            content: 'User not found. Please check your email or sign up.',
                            duration: 4000
                        });
                    } else if (error.message && error.message.includes('password')) {
                        Message.error({
                            content: 'Wrong password. Please try again.',
                            duration: 4000
                        });
                    } else {
                        Message.error({
                            content: 'Failed to sign in. Please try again.',
                            duration: 4000
                        });
                    }
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <div className='sign-in-container'>
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Email"
                    type='email'
                    required
                    onChange={handleChange}
                    name='email'
                    value={email}
                />

                <FormInput
                    label="Password"
                    type='password'
                    required
                    onChange={handleChange}
                    name='password'
                    value={password}
                />
                <div className='buttons-container'>
                    <Button type="submit">Sign In</Button>
                    <Button type='button' buttonType='google' onClick={signInWithGoogle}>Google sign in</Button>
                </div>
            </form>
        </div>
    );
};

export default SignInForm;
