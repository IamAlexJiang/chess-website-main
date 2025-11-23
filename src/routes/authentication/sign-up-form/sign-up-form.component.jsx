import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '@arco-design/web-react';

import FormInput from '../../../components/form-input/form-input.component.jsx';
import Button from '../../../components/button/button.component.jsx';

import { 
    createAuthUserWithEmailAndPassword, 
    createUserDocumentFromAuth 
} from '../../../utils/firebase/firebase.utils.js';

import './sign-up-form.styles.scss';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password !== confirmPassword) {
            Message.error({
                content: 'Passwords do not match. Please try again.',
                duration: 4000
            });
            return;
        }

        if(password.length < 6) {
            Message.error({
                content: 'Password must be at least 6 characters long.',
                duration: 4000
            });
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(
                email, 
                password
            );

            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
            
            Message.success({
                content: 'Signed up successfully! Redirecting to home page...',
                duration: 3000
            });
            
            // Navigate to home page after a brief delay to show success message
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch(error) {
            console.error('Sign up error:', error);
            
            if(error.code === 'auth/email-already-in-use') {
                Message.error({
                    content: 'Cannot create user, email already in use.',
                    duration: 4000
                });
            } else if(error.code === 'auth/weak-password') {
                Message.error({
                    content: 'Password must be at least 6 characters long.',
                    duration: 4000
                });
            } else if(error.code === 'auth/invalid-email') {
                Message.error({
                    content: 'Email not valid. Please enter a valid email address.',
                    duration: 4000
                });
            } else {
                Message.error({
                    content: 'An error occurred during sign up. Please try again.',
                    duration: 4000
                });
            } 
        }
    };


    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormFields({...formFields, [name]: value});
    };

    return (
        <div className='sign-up-container'>
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Display Name"
                    type='text' 
                    required 
                    onChange={handleChange} 
                    name="displayName" 
                    value={displayName} />

                <FormInput
                    label="Email"
                    type='email' 
                    required 
                    onChange={handleChange} 
                    name='email'
                    value={email} />

                <FormInput
                    label="Password"
                    type='password' 
                    required 
                    minLength={6}
                    onChange={handleChange} 
                    name='password' 
                    value={password} />

                <FormInput
                    label="Confirm Password"
                    type='password' 
                    required 
                    minLength={6}
                    onChange={handleChange} 
                    name='confirmPassword' 
                    value={confirmPassword} />
                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
};

export default SignUpForm