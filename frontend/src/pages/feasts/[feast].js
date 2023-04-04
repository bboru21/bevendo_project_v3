import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import Link from 'next/link';

const Feast = ({ error, feast }) => {
   
    const router = useRouter();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (typeof window !== 'undefined' && !loading && !isAuthenticated) {
        router.push('/login');
    }

    return (
        <Layout
            title='Bevendo | Feast'
            content='Feast day profile page.'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    <h1 className='display-5 fw-bold'>
                        {feast.name}
                    </h1>
                    {error ? (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    ) : (
                      <>
                        <h2>Cocktails</h2>
                        {feast.cocktails.map( cocktail => (
                          <div>
                            <Link href={`/cocktails/${cocktail.slug}/`}>{cocktail.name}</Link>
                          </div>
                        ))}
                      </>
                    )}
                </div>
           </div>
        </Layout>
    );
};


export async function getServerSideProps({ params, req }) {

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
        const { feast } = params;

        const res = await fetch(`${API_URL}/api/v1/pages/feasts/${feast}`, {
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
                    feast: data.feast,
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

export default Feast;