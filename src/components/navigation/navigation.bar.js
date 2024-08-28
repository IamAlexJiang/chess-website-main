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
            Gallery
          </Link>
          <Link className='nav-link' to='/endgame'>
            Endgame
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
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;





// import Fragment from 'react'
// import { Outlet, Link } from 'react-router-dom';

// import { ReactComponent as PawnLogo } from '../../logo.svg'; 

// import './navigation.bar.scss'

// const Navigation = () => {
//   return (
//     <Fragment>
//       <div className='navigation'>
//         <link className='logo-container' to='/'>
//           <PawnLogo className='logo'/>
//         </link>
//         <div className='nav-links-container'>
//           <Link className='nav-link' to='/gallery'>
//             Gallery
//           </Link> 
//           <Link className='nav-link' to='/board'>
//             Board
//           </Link> 
//           <Link className='nav-link' to='/auth'>
//             Sign In
//           </Link> 
//         </div>
//       </div>
//       <Outlet />
//     </Fragment>
//   );
// };

// export default Navigation