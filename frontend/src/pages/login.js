import { useState, useEffect } from 'react';
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

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const {
        username,
        password,
    } = formData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(reset_register_success());
        }
    }, []);

    const handleOnChange = event => setFormData({
        ...formData,
        [event.target.name]: event.target.value,
    });

    const handleOnSubmit = event => {
        event.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(login(username, password));
        }
    };

    if (typeof window !== 'undefined' && isAuthenticated) {
        router.push('/dashboard');
    }
    return (
        <Layout
            title='Bevendo | Register'
            content='Login page for Bevendo app'>
            <>
                <h1 className='display-4 mt-5'>Login Page</h1>
                <form
                    className='bg-light p-5 mt-5 mb-5'
                    onSubmit={handleOnSubmit}
                >
                    <h3>Log Into Your Account</h3>

                    <div className='form-group'>
                        <label className='form-label mt-5' htmlFor='username'>
                            <strong>Username*</strong>
                        </label>
                        <input
                            className='form-control'
                            type='text'
                            name='username'
                            placeholder='Username*'
                            onChange={handleOnChange}
                            value={username}
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
                            onChange={handleOnChange}
                            value={password}
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