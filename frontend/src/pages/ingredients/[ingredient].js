import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import ControlledBeverageItem from '../../components/ingredients/ControlledBeverageItem';
import { performAPIGet } from '../../utils/api';


const Ingredient = ({ error, ingredient }) => {

    loginRedirect();

    // TODO refactor so parents do not have to be repeated
    const breadcrumbs = error ? [] : [
        { href: '/dashboard', text: 'Dashboard'},
        { href: '/ingredients', text: 'Ingredients'},
        { href: ingredient.urlname, text: ingredient.name, active: true},
    ];

    const title = error ? 'Ingredient' : ingredient.name;

    return (
        <Layout
            title={title}
            content='Ingredient profile page.'
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
                            text={ingredient.name}
                        />

                        {ingredient.controlled_beverages.length > 0 && (
                            <>
                            <h2>Products</h2>

                            <ul className="product-list">
                            {ingredient.controlled_beverages.map(beverage => {
                                if (beverage.current_prices.length > 0) {
                                    return (
                                        <li key={beverage.pk}>
                                            <ControlledBeverageItem beverage={beverage} />
                                        </li>
                                    );
                                }
                            })}
                            </ul>
                            </>
                        )}
                      </>
                    )}
                </div>
           </div>
        </Layout>
    );
};


export async function getServerSideProps({ params, req }) {

    try {
        const { ingredient } = params;

        const res = await performAPIGet(`/pages/ingredients/${ingredient}`, req);

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