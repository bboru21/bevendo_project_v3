import { useEffect } from 'react';
import Layout from '../hocs/Layout';
import Heading from '../components/Heading';
import { useDispatch, useSelector } from 'react-redux';
import { send_password_reset_email, reset_send_password_reset_email_success } from '../actions/auth';
import classNames from 'classnames';

const ResetPassword = () => {

  const send_password_reset_email_success = useSelector(state => state.auth.send_password_reset_email_success);
  const send_password_reset_email_message = useSelector(state => state.auth.send_password_reset_email_message);


  const dispatch = useDispatch();

  useEffect(() => {
    if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
      dispatch(reset_send_password_reset_email_success());
    }
  }, [dispatch]);

  const handleSubmit = event => {
    event.preventDefault();

    const email = event.target.querySelector('input[name="email"]').value;

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(send_password_reset_email(email));
    }
  }
  return (
    <Layout
      title='Bevendo | Password Reset'
      content='Password Reset page for Bevendo app'
    >
      <>
        <form
           className='bg-light p-5 mt-5 mb-5'
           onSubmit={handleSubmit}
        >
          <Heading text="Reset Password" />

          <p>Please enter your email address associated with your account. A message will be sent to that address with a link allowing you to update your password.</p>

          <label className='form-label' htmlFor='email'>
            <strong>Email*</strong>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className='form-control mb-3'
            placeholder='Email*'
            required
          />

          <div className={classNames('mb-3', {
            ['visible']: send_password_reset_email_message!==null,
            ['invisible']: send_password_reset_email_message===null,
            ['text-success']: send_password_reset_email_success===true,
            ['text-danger']: send_password_reset_email_success===false,
          })}>
            {send_password_reset_email_message || '[Placeholder]'}
          </div>

          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </form>
      </>
    </Layout>
  );
};

export default ResetPassword;