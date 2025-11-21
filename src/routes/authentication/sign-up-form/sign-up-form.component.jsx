import { useState } from 'react';

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

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if(password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(
                email, 
                password
            );

            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
        } catch(error) {
            if(error.code === 'auth/email-already-in-use') {
                alert('Cannot create user, email already in use');
            } else if(error.code === 'auth/weak-password') {
                alert('Password must be at least 6 characters long');
            } else {
                console.log('user creation encountered an error', error);
                alert('An error occurred during sign up. Please try again.');
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