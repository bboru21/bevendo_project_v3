import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../../config/index';
import loginRedirect from '../../hooks/loginRedirect';
import { USDollar } from '../../utils/currency';
import ProConIcon from '../../components/ProConIcon';
import ExternalLink from '../../components/ExternalLink';
import Heading from '../../components/Heading';


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
                            {ingredient.controlled_beverages.map(b => (
                                <li key={b.pk}>
                                    <h3>{b.name}</h3>
                                    {b.current_prices.length > 0 && (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Size</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">
                                                        <span className="d-block d-md-none">PPL</span>
                                                        <span className="d-none d-md-block">Price/Liter</span>
                                                    </th>
                                                    <th scope="col">
                                                        <span className="d-block d-md-none">Best</span>
                                                        <span className="d-none d-md-block">Is Best Price?</span>
                                                    </th>
                                                    <th scope="col">
                                                        <span className="d-block d-md-none">Above Best</span>
                                                        <span className="d-none d-md-block">Amount Above Best Price</span>
                                                    </th>
                                                    <th scope="col">
                                                        <span className="d-block d-md-none">Sale</span>
                                                        <span className="d-none d-md-block">Is On-Sale?</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {b.current_prices.map(p => (
                                                <tr key={p.pk}>
                                                    <td>
                                                        {p.url ? (<ExternalLink href={p.url}>{p.size}</ExternalLink>) : (<>{p.size}</>)}
                                                    </td>
                                                    <td>{USDollar.format(p.current_price)}</td>
                                                    <td>{USDollar.format(p.price_per_liter)}</td>
                                                    <td><ProConIcon isPro={p.is_best_price} /></td>
                                                    <td>{!p.is_best_price ? USDollar.format(p.amount_above_best_price) : ''}</td>
                                                    <td><ProConIcon isPro={p.is_on_sale} /></td>
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