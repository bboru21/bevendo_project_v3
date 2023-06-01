import Layout from '../../hocs/Layout';
import cookie from 'cookie';
import { API_URL, CATHOLIC_CULTURE_URL } from '../../config/index';
import ExternalLink from '../../components/ExternalLink';
import LinkList from '../../components/LinkList';
import { displayDate } from '../../utils/dates';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';


const Feast = ({ error, feast }) => {

    loginRedirect();

    return (
        <Layout
            title='Bevendo | Feast'
            content='Feast day profile page.'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    {error ? (
                        <>
                            <p className='fs-4 mt-3'>
                                {error}
                            </p>
                        </>
                    ) : (
                        <>
                            <Heading
                                text={feast.name}
                                subtext={displayDate(feast.date)}
                            />

                            <p className="fs-5 fw-bold">External Links:</p>
                            <ul>
                                <li>
                                    <ExternalLink href={`${CATHOLIC_CULTURE_URL}?date=${feast.date}`}>
                                        CatholicCulture.org
                                    </ExternalLink>
                                </li>
                            </ul>

                            <LinkList title="Cocktails" links={feast.cocktails} />
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