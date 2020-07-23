import React from 'react';
import { Link } from 'react-router-dom';
import Auth from './Auth.jsx';

const Header = ({ authenticated, user }) => (
    <header className='flex justify-between items-center mb-6 h-16'>
        <Link to='/'>
            <h1 className='text-blue-600 font-bold text-2xl'>Eruditio</h1>
        </Link>
        <nav className='flex items-center'>
            <Link className='mx-4' to='/'>Home</Link>
            <Link className='mx-4' to='/tutors'>Tutors</Link>
            { authenticated && <Link className='mx-4' to='/connections'>Connections</Link> }
        </nav>
        <div className='flex'>
            {authenticated
                && user.hasProfile
                && <Link to={`/users/${user.shortId}`} className='mr-8'>My Profile</Link>}
            <Auth authenticated={authenticated}/>
        </div>
    </header>
);

export default Header;
