import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../hocs/Layout';
import loginRedirect from '../hooks/loginRedirect';
import Heading from '../components/Heading';
import { change_password, reset_change_password_success} from '../actions/auth';
import classNames from 'classnames';

const Profile = () => {

    loginRedirect();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const change_password_success = useSelector(state => state.auth.change_password_success);
    const change_password_message = useSelector(state => state.auth.change_password_message);

    const dispatch = useDispatch();

    useEffect(() => {
        if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
            dispatch(reset_change_password_success());
        }
    }, [dispatch]);

    const handleChangePasswordSubmit = event => {
      event.preventDefault();

      const current_password = event.target.querySelector('input[name="current_password"]').value;
      const new_password = event.target.querySelector('input[name="new_password"]').value;
      const re_new_password = event.target.querySelector('input[name="re_new_password"]').value;

      if (dispatch && dispatch !== null && dispatch !== undefined) {
        dispatch(change_password(current_password, new_password, re_new_password));
      }
    };

    const shouldRender = (isAuthenticated && user);

    // TODO figure out better way to perform isAuthenticated check via inheritance, Higher Order Component or ?
    return !shouldRender ? <></> : (
        <Layout
            title='Bevendo | Profile'
            content='User profile for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    <Heading text="User Profile" subtext={`${user.first_name} ${user.last_name}`} />
                </div>
           </div>

           <form
            className='bg-light p-5 mt-5 mb-5'
            onSubmit={handleChangePasswordSubmit}
            >
              <h2>Change Password</h2>
              <div className='form-group mb-3'>
                  <label className='form-label mt-5' htmlFor='current_password'>
                      <strong>Current Password*</strong>
                  </label>
                  <input
                      className='form-control'
                      type='password'
                      name='current_password'
                      id='current_password'
                      placeholder='Current Password*'
                      minLength={8}
                      required
                  />

                  <label className='form-label mt-5' htmlFor='new_password'>
                      <strong>New Password*</strong>
                  </label>
                  <input
                      className='form-control'
                      type='password'
                      name='new_password'
                      id='new_password'
                      placeholder='New Password*'
                      minLength={8}
                      required
                  />

                  <label className='form-label mt-5' htmlFor='re_new_password'>
                      <strong>Confirm New Password*</strong>
                  </label>

                  <input
                      className='form-control'
                      type='password'
                      name='re_new_password'
                      id='re_new_password'
                      placeholder='Confirm New Password*'
                      minLength={8}
                      required
                  />
              </div>

              <div className={classNames('mb-3', {
                ['visible']: change_password_message!==null,
                ['invisible']: change_password_message===null,
                ['text-success']: change_password_success===true,
                ['text-danger']: change_password_success===false,
              })}>
                {change_password_message || '[Placeholder]'}
              </div>

              <button className='btn btn-primary' type='submit'>
                  Change Password
              </button>

           </form>
        </Layout>
    );
};




export default Profile;