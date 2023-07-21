import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import ControlledBeverageItem from '../../components/ingredients/ControlledBeverageItem';


const Ingredient = ({ error, ingredient }) => {

    loginRedirect();

    return (
        <Layout
            title='Bevendo | Ingredient'
            content='Ingredient profile page.'
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
                            {ingredient.controlled_beverages.map(beverage => (
                                <li key={beverage.pk}>
                                    <ControlledBeverageItem beverage={beverage} />
                                </li>
                            ))}
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