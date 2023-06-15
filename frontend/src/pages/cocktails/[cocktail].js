import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import LinkList from '../../components/LinkList';
import loginRedirect from '../../hooks/loginRedirect';
import FavoriteButton from '../../components/FavoriteButton';
import Link from 'next/link';
import Heading from '../../components/Heading';

const Cocktail = ({ error, cocktail }) => {

    loginRedirect();

    return (
        <Layout
            title='Bevendo | Cocktail'
            content='Cocktail profile page.'
        >
           <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
                <div className='container-fluid py-3'>
                    {error ? (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    ) : (
                      <>
                        <Heading
                            text={cocktail.name}
                            button={<FavoriteButton className="ms-2" cocktailId={cocktail.pk} />}
                        />
                        <ul>
                          {cocktail.ingredients.map(i => (
                           <li key={i.pk}>
                            {i.ingredient.is_controlled ? (
                                <Link href={i.ingredient.urlname}>
                                    <a>
                                    {i.amount} {i.measurement} {i.ingredient.name}
                                    </a>
                                </Link>
                            ) : (
                                <>
                                {i.amount} {i.measurement} {i.ingredient.name}
                                </>
                            )}
                           </li>
                          ))}
                        </ul>
                        <p>{cocktail.instructions}</p>

                        <LinkList title="Feasts" links={cocktail.feasts} />
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
        const { cocktail } = params;

        const res = await fetch(`${API_URL}/api/v1/pages/cocktails/${cocktail}`, {
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
                    cocktail: data.cocktail,
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

export default Cocktail;