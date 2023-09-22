import Layout from '../../hocs/Layout';
import LinkList from '../../components/LinkList';
import loginRedirect from '../../hooks/loginRedirect';
import FavoriteButton from '../../components/FavoriteButton';
import Link from 'next/link';
import Heading from '../../components/Heading';
import { performAPIGet } from '../../utils/api';

const Cocktail = ({ error, cocktail }) => {

    loginRedirect();

    // TODO refactor so parents do not have to be repeated
    const breadcrumbs = error ? [] : [
        { href: '/dashboard', text: 'Dashboard'},
        { href: '/cocktails', text: 'Cocktails'},
        { href: cocktail.urlname, text: cocktail.name, active: true},
    ];

    const title = error ? 'Cocktail' : cocktail.name;

    return (
        <Layout
            title={title}
            content='Cocktail profile page.'
            breadcrumbs={breadcrumbs}
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



    try {
        const { cocktail } = params;

        const res = await performAPIGet(`/pages/cocktails/${cocktail}`, req);

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