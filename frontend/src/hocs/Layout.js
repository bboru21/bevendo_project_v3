import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { request_refresh } from '../actions/auth';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import GoogleAnalyticsTag from '../components/GoogleAnalyticsTag';
import Loader from '../components/Loader';

const Layout = ({ title, content, breadcrumbs: breadcrumbsProp=[], showBreadcrumbs=true, children }) => {

    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

    useEffect(() => {
        if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
            dispatch(request_refresh());  // will also dispatch check_auth_status
        }
    }, [dispatch]);

    const breadcrumbs = [
        { href: '/', text: 'Dashboard'},
        ...breadcrumbsProp,
    ];

    return (
        <>
            <GoogleAnalyticsTag />
            <Head>
                <title>{`Bevendo | ${title}`}</title>
                <meta name='description' content={content} />
            </Head>

            <div id="global-container">
                {process.env.NODE_ENV !== 'production' && (
                    <div style={{ width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center'}}>
                        Node Environment: {process.env.NODE_ENV}
                    </div>
                )}
                <Navbar />
                {showBreadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
                <div className='container mt-5 position-relative'>
                    <>
                        {loading && <Loader overlay />}
                        {children}
                    </>
                </div>
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