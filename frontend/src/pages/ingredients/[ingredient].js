import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import loginRedirect from '../../hooks/loginRedirect';
import { USDollar } from '../../utils/currency';
import ProConIcon from '../../components/ProConIcon';


const Ingredient = ({ error, ingredient }) => {

    loginRedirect();

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

                        {ingredient.controlled_beverages.length > 0 && (
                            <>
                            <h2>Products</h2>

                            <ul>
                            {ingredient.controlled_beverages.map(b => (
                                <li key={b.pk}>
                                    <h3>{b.name}</h3>
                                    {b.current_prices.length > 0 && (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Size</th>
                                                    <th>Price</th>
                                                    <th>Is On Sale?</th>
                                                    <th>Price/Liter</th>
                                                    <th>Price Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {b.current_prices.map(p => (
                                                <tr key={p.pk}>
                                                    <td>{p.size}</td>
                                                    <td>{USDollar.format(p.current_price)}</td>
                                                    <td>
                                                        <ProConIcon isPro={p.is_on_sale} />
                                                    </td>
                                                    <td>{USDollar.format(p.price_per_liter)}</td>
                                                    <td>{p.price_score}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
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