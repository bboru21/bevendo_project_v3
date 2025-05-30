import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login, reset_register_success } from '../actions/auth';
import Layout from '../hocs/Layout';
import { Oval as Loader } from 'react-loader-spinner';
import Heading from '../components/Heading';
import Link from 'next/link';

const LoginPage = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    useEffect(() => {
        if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
            dispatch(reset_register_success());
        }
    }, [dispatch]);

    const handleSubmit = event => {
        /*
            Values retrieved onSubmit instead of onChange to accomodate cases
            where autofill does not trigger the latter.
        */
        event.preventDefault();

        const username = event.target.querySelector('input[name="username"]').value;
        const password = event.target.querySelector('input[name="password"]').value;

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(login(username, password));
        }
    };

    if (typeof window !== 'undefined' && isAuthenticated) {

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        router.push(redirect ? redirect : '/');

        return <></>;
    }
    return (
        <Layout
            title='Login'
            content='Login page for Bevendo app'
            showBreadcrumbs={false}
        >
            <>
                <form
                    className='bg-light p-5 mt-5 mb-5'
                    onSubmit={handleSubmit}
                >
                    <Heading text="Login" className="mb-3" />

                    <p className="fs-4">Welcome to Bevendo, a cocktail app project.<br/> Please login to continue.</p>

                    <div className='form-group'>
                        <label className='form-label mt-5' htmlFor='username'>
                            <strong>Username*</strong>
                        </label>
                        <input
                            className='form-control mb-3'
                            type='text'
                            name='username'
                            id="username"
                            placeholder='Username*'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='password'>
                            <strong>Password*</strong>
                        </label>
                        <input
                            className='form-control mb-3'
                            type='password'
                            name='password'
                            id="password"
                            placeholder='Password*'
                            minLength={8}
                            required
                        />

                        <p><Link href='/send-password-reset-email'>Forgot password?</Link> | <a href="mailto:bryan.e.hadro@gmail.com?subject=Bevendo%20Access%20Request">Request Access</a></p>
                    </div>
                    { !loading && (
                        <button className='btn btn-primary' type='submit'>
                            Login
                        </button>
                    )}
                </form>

                {/* temporarily disable until we are ready for new members to register */}
                {process.env.NODE_ENV !== 'production' && (
                    <p>
                        Don&rsquo;t have an account? <Link href='/register'>Sign-up</Link>.
                    </p>
                )}
            </>
        </Layout>
    );
};

export default LoginPage;