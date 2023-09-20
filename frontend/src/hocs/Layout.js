import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { request_refresh } from '../actions/auth';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';

const Layout = ({ title, content, breadcrumbs: breadcrumbs=[], children }) => {

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

            <div id="global-container">
                {process.env.NODE_ENV !== 'production' && (
                    <div style={{ width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center'}}>
                        Node Environment: {process.env.NODE_ENV}
                    </div>
                )}
                <Navbar />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className='container mt-5'>{children}</div>
                <footer className="bg-light p-3">
                    <a href="mailto:bryan.e.hadro@gmail.com">Contact</a>
                </footer>
            </div>
        </>
    );
}

Layout.defaultProps = {
    title: 'Bevendo',
    content: 'A companion app to Drinking with the Saints'
};

export default Layout;