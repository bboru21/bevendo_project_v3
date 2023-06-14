
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../hocs/Layout';
import Heading from '../components/Heading';
import FormControlFeedback from '../components/FormControlFeedback';
import Link from 'next/link';
import { reset_password, reset_password_reset_success } from '../actions/auth';

const ResetPasswordPage = ({ uidb64, token, error }) => {

  const password_reset_success = useSelector(state => state.auth.password_reset_success);
  const password_reset_message = useSelector(state => state.auth.password_reset_message);

  const dispatch = useDispatch();

  useEffect(() => {
      if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
          dispatch(reset_password_reset_success());
      }
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    const password = data.get('password'),
    re_password =  data.get('re_password'),
    uidb64 = data.get('uidb64'),
    token = data.get('token');

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(reset_password(
        password,
        re_password,
        uidb64,
        token,
      ));
    }
  }
  return (
    <Layout
      title='Bevendo | Reset Password'
      content='Reset Password page for Bevendo App'
    >

      <form className='bg-light p-5 mt-5 mb-5' onSubmit={handleSubmit}>

        <Heading text="Reset Password" />

        {!!error ? (
          <>
            <p>{error}</p>
            <p>Please visit the <Link href="/send-password-reset-email">Send Password Reset Email page</Link> to restart the recovery process.</p>
          </>
        ) : (
          <p>Please enter a new password.</p>
        )}

        <div className='form-group mb-3'>
            <label className='form-label mt-5' htmlFor='password'>
                <strong>New Password*</strong>
            </label>
            <input
                className='form-control'
                type='password'
                name='password'
                id='password'
                placeholder='New Password*'
                minLength={8}
                required
                disabled={!!error ? true : false}
            />

            <label className='form-label mt-5' htmlFor='re_password'>
                <strong>Confirm New Password*</strong>
            </label>

            <input
                className='form-control'
                type='password'
                name='re_password'
                id='re_password'
                placeholder='Confirm New Password*'
                minLength={8}
                required
                disabled={!!error ? true : false}
            />
        </div>

        <FormControlFeedback
          className="mb-3"
          message={password_reset_message}
          success={password_reset_success}
        />

        <input type="hidden" name="uidb64" value={uidb64} required />
        <input type="hidden" name="token" value={token} required />

        <button
          className='btn btn-primary mb-3'
          type='submit'
          disabled={!!error ? true : false}
        >
            Change Password
        </button>

        <p><Link href='/send-password-reset-email'>Re-send Password Reset Email</Link></p>
        <p><Link href='/login'>Login</Link></p>

      </form>

    </Layout>
  );
};

export function getServerSideProps({ query }) {
  const { uidb64=null, token=null } = query;

  if (typeof uidb64 === "string" && typeof token==="string") {
    return {
      props: {
        error: null,
        uidb64,
        token,
      }
    }
  } else {
    return {
      props: {
        error: 'This password recovery link is invalid.',
        uidb64,
        token,
      }
    }
  }
}

export default ResetPasswordPage;