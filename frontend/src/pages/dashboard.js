import { useSelector } from 'react-redux';
import Layout from '../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../config/index';
import FeastSwiper from '../components/FeastSwiper';
import { loginRedirect } from '../utils/auth.js';

const Dashboard = ({ error, feasts }) => {

    loginRedirect();

    const user = useSelector(state => state.auth.user);

    return (
        <Layout
            title='Bevendo | Dashboard'
            content='Dashboard for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    <h1 className='display-5 fw-bold'>
                        User Dashboard
                    </h1>
                    <p className='fs-4 mt-3'>
                        Welcome to Bevendo{user === null ? '' : `, ${user.first_name}`}!
                    </p>
                    {error && (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    )}
                </div>
                {feasts && (
                    <div className='container-fluid py-3'>
                        <h2 className='display-7 fw-bold mb-3'>
                            Upcoming Feasts and Cocktails
                        </h2>
                        <FeastSwiper feasts={feasts} />
                    </div>
                )}
           </div>
        </Layout>
    );
};


export async function getServerSideProps({ req }) {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    // this should never happen, but just in case
    if (access === false) {
        return {
            props: {
                error: 'User unauthorized to load page data',
            }
        };
    }

    try {
        const res = await fetch(`${API_URL}/api/v1/pages/dashboard`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
        });

        if (res.status === 200) {
            const data = await res.json();

            return {
                props: {
                    feasts: data.feasts,
                }
            };

        } else {
            console.error(`API request returned status ${res.status}`);
            return {
                props: {
                    error: 'Something went wrong loading page data',
                }
            };
        }
    } catch(error) {
        console.error(error);
        return {
            props: {
                error: 'Something went wrong loading page data',
            }
        }
    }
}

export default Dashboard;