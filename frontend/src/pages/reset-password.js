import Layout from '../hocs/Layout';
import Heading from '../components/Heading';
import { useDispatch } from 'react-redux';
import { send_password_reset_email } from '../actions/auth';

const ResetPassword = () => {

  const dispatch = useDispatch();

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

          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </form>
      </>
    </Layout>
  );
};

export default ResetPassword;