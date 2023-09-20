import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/auth';
import SearchBar from './SearchBar';

const Navbar = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const logoutHandler = () => {
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(logout());
        }
    };

    const guestLinks = (
        <>
            {/* temporarily disable until we are ready for new members to register */}
            {process.env.NODE_ENV !== 'production' && (
                <li className='nav-item'>
                    <Link href='/register'>
                    <a
                        className={
                            router.pathname === '/register' ?
                            'nav-link active' : 'nav-link'
                        }
                        aria-current={
                            router.pathname === '/register' ?
                            'page' : 'false'
                        }
                    >
                        Register
                    </a>
                    </Link>
                </li>
            )}
            <li className='nav-item'>
                <Link href='/login'>
                <a
                    className={
                        router.pathname === '/login' ?
                        'nav-link active' : 'nav-link'
                    }
                    aria-current={
                        router.pathname === '/login' ?
                        'page' : 'false'
                    }
                >
                    Login
                </a>
                </Link>
            </li>
        </>
    );

    const authLinks = (
        <>
            <li className='nav-item'>
              <Link href='/dashboard'>
                <a
                    className={
                        router.pathname === '/dashboard' ?
                        'nav-link active' : 'nav-link'
                    }
                    aria-current={
                        router.pathname === '/dashboard' ?
                        'page' : 'false'
                    }
                >
                    Dashboard
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/feasts'>
                <a
                    className={
                        router.pathname === '/feasts' ?
                        'nav-link active' : 'nav-link'
                    }
                    aria-current={
                        router.pathname === '/feasts' ?
                        'page' : 'false'
                    }
                >
                    Feasts
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/cocktails'>
                <a
                    className={
                        router.pathname === '/cocktails' ?
                        'nav-link active' : 'nav-link'
                    }
                    aria-current={
                        router.pathname === '/cocktails' ?
                        'page' : 'false'
                    }
                >
                    Cocktails
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/profile'>
                <a
                    className={
                        router.pathname === '/profile' ?
                        'nav-link active' : 'nav-link'
                    }
                    aria-current={
                        router.pathname === '/profile' ?
                        'page' : 'false'
                    }
                >
                    Profile
                </a>
              </Link>
            </li>
            <li className='nav-item'>
                <a
                    className='nav-link'
                    href='#!'
                    onClick={logoutHandler}
                >
                    Logout
                </a>
            </li>
        </>
    );

    return (
        <nav className='navbar navbar-expand-lg bg-light'>
          <div className='container-fluid'>
            <Link href='/'>
                <a className='navbar-brand'>Bevendo!</a>
            </Link>
            <button
                className='navbar-toggler'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#navbarSupportedContent'
                aria-controls='navbarSupportedContent'
                aria-expanded='false'
                aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <li className='nav-item'>
                  <Link href='/'>
                    <a
                        className={
                            router.pathname === '/' ?
                            'nav-link active' : 'nav-link'
                        }
                        aria-current={
                            router.pathname === '/' ?
                            'page' : 'false'
                        }
                    >
                        Home
                    </a>
                  </Link>
                </li>
                { isAuthenticated ? authLinks : guestLinks }
              </ul>
              { isAuthenticated && <SearchBar />}
            </div>
          </div>
        </nav>
    );
};

export default Navbar;