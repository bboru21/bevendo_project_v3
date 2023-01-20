import { useEffect } from 'react';
import Layout from '../hocs/Layout';

const Dashboard = () => {
   
    useEffect(() => {
        /* TODO for debugging, remove me */
        // async () => {
            /* await */ fetch('/api/account/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
        // }
    }, []);
    return (
        <Layout
            title='Bevendo | Dashboard'
            content='Dashboard for Bevendo, a companion app to Drinking with the Saints'
        >
            <>
                <h1>Dashboard</h1>
            </>
        </Layout>
    );
};

export default Dashboard;