import Layout from '../../hocs/Layout';
import { CATHOLIC_CULTURE_URL } from '../../config/index';
import ExternalLink from '../../components/ExternalLink';
import LinkList from '../../components/LinkList';
import { displayDate } from '../../utils/dates';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import { performAPIGet } from '../../utils/api';


const Feast = ({ error, feast }) => {

    loginRedirect();

    const breadcrumbs = error ? [] : [
        { href: '/feasts', text: 'Feasts'},
        { href: feast.urlname, text: feast.name, active: true },
    ];

    return (
        <Layout
            title='Bevendo | Feast'
            content='Feast day profile page.'
            breadcrumbs={breadcrumbs}
        >
           <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
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

    try {
        const { feast } = params;

        const res = await performAPIGet(`/pages/feasts/${feast}`, req);

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