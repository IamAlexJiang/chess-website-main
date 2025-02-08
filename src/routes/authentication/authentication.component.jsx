import { Fragment } from 'react';
import SignUpForm from './sign-up-form/sign-up-form.component.jsx';
import SignInForm from './sign-in-form/sign-in-form.component.jsx';

import './authentication.styles.scss'

const Authentication = () => {
    return (
        <Fragment>
            <h1 className='auth-title'>Sign In Page</h1>
            <div className='authentication-container'>
                <SignInForm />
                <SignUpForm />
            </div>
        </Fragment>
    );
};

export default Authentication;