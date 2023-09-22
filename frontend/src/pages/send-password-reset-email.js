import { useEffect } from 'react';
import Layout from '../hocs/Layout';
import Heading from '../components/Heading';
import { useDispatch, useSelector } from 'react-redux';
import { send_password_reset_email, reset_send_password_reset_email_success } from '../actions/auth';
import FormControlFeedback from '../components/FormControlFeedback';

const SendPasswordResetEmailPage = () => {

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
      title='Send Password Reset Email'
      content='Send Password Reset Email page for Bevendo app'
    >
      <>
        <form
           className='bg-light p-5 mt-5 mb-5'
           onSubmit={handleSubmit}
        >
          <Heading text="Send Password Reset Email" />

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

          <FormControlFeedback
            className="mb-3"
            message={send_password_reset_email_message}
            success={send_password_reset_email_success}
          />

          <button className='btn btn-primary' type='submit'>
            Send Email
          </button>
        </form>
      </>
    </Layout>
  );
};

export default SendPasswordResetEmailPage;