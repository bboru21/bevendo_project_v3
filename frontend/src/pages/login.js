import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login, reset_register_success } from '../actions/auth';
import Layout from '../hocs/Layout';
import { Oval as Loader } from 'react-loader-spinner';

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
        router.push(redirect ? redirect : '/dashboard');

        return <></>;
    }
    return (
        <Layout
            title='Bevendo | Login'
            content='Login page for Bevendo app'>
            <>
                <form
                    className='bg-light p-5 mt-5 mb-5'
                    onSubmit={handleSubmit}
                >
                    <h1 className='display-5 fw-bold'>
                        Log Into Your Account
                    </h1>

                    <div className='form-group'>
                        <label className='form-label mt-5' htmlFor='username'>
                            <strong>Username*</strong>
                        </label>
                        <input
                            className='form-control'
                            type='text'
                            name='username'
                            placeholder='Username*'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label mt-5' htmlFor='password'>
                            <strong>Password*</strong>
                        </label>
                        <input
                            className='form-control'
                            type='password'
                            name='password'
                            placeholder='Password*'
                            minLength={8}
                            required
                        />
                    </div>
                    {
                        loading ? (
                            <div className='d-flex justify-content-center align-items-center mt-5'>
                                <Loader
                                    type='Oval'
                                    color='#00bfff'
                                    width={50}
                                    height={50}
                                />
                            </div>
                        ) : (
                            <button className='btn btn-primary mt-5' type='submit'>
                                Login
                            </button>
                        )
                    }
                </form>
            </>
        </Layout>
    );
};

export default LoginPage;