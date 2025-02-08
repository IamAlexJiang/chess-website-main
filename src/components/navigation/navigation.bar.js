import React, { Fragment, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { UserContext } from '../../contexts/user.context';

import { ReactComponent as PawnLogo } from '../../logo.svg';
import { signOutUser } from '../../utils/firebase/firebase.utils'

import './navigation.bar.scss';

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  
  return (
    <Fragment>
      <div className='sidebar'>
        <Link to='/' className='PawnLogo'>
          <PawnLogo />
        </Link>
        <div className='nav-links-container'>
          <Link className='nav-link' to='/gallery'>
            Openings
          </Link>
          <Link className='nav-link' to='/endgame'>
            Endgames
          </Link>
          <Link className='nav-link' to='/board'>
            Board
          </Link>
            {currentUser ? (
              <span className='nav-link' onClick={signOutUser}>
                Sign Out
              </span>
            ) : (
              <Link className='nav-link' to='/auth'>
                Sign In
              </Link>
            )}
          <h2 className='footer'>© 2024 OpeningMatrix</h2>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;

