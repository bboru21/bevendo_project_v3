import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { request_refresh } from '../actions/auth';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const Layout = ({ title, content, children }) => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
            dispatch(request_refresh());  // will also dispatch check_auth_status
        }
    }, [dispatch]);
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='description' content={content} />
            </Head>
            {process.env.NODE_ENV !== 'production' && (
                <div style={{ width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center'}}>
                    Node Environment: {process.env.NODE_ENV}
                </div>
            )}
            <Navbar />
            <div className='container mt-5'>{children}</div>
        </>
    );
}

Layout.defaultProps = {
    title: 'Bevendo',
    content: 'A companion app to Drinking with the Saints'
};

export default Layout;