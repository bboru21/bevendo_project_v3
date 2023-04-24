import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import LinkList from '../../components/LinkList';

const Ingredient = ({ error, ingredient }) => {

    const router = useRouter();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    if (typeof window !== 'undefined' && !loading && !isAuthenticated) {
        router.push('/login');
    }

    return (
        <Layout
            title='Bevendo | Ingredient'
            content='Ingredient profile page.'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    {error ? (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    ) : (
                      <>
                        <h1 className='display-5 fw-bold'>
                            {ingredient.name}
                        </h1>
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
        const { ingredient } = params;

        const res = await fetch(`${API_URL}/api/v1/pages/ingredients/${ingredient}`, {
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
                  ingredient: data.ingredient,
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

export default Ingredient;