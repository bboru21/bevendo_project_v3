import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../hocs/Layout';
import loginRedirect from '../hooks/loginRedirect';
import Heading from '../components/Heading';
import {
    change_password,
    reset_change_password_success,
    change_email,
    reset_change_email_success,
} from '../actions/auth';
import FormControlFeedback from '../components/FormControlFeedback';

const Profile = () => {

    loginRedirect();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const change_password_success = useSelector(state => state.auth.change_password_success);
    const change_password_message = useSelector(state => state.auth.change_password_message);
    const change_email_success = useSelector(state => state.auth.change_email_success);
    const change_email_message = useSelector(state => state.auth.change_email_message);

    const dispatch = useDispatch();

    useEffect(() => {
        if (dispatch && dispatch !== null && typeof dispatch !== 'undefined') {
            dispatch(reset_change_password_success());
            dispatch(reset_change_email_success());
        }
    }, [dispatch]);

    const handleChangeEmailSubmit = event => {
        event.preventDefault();

        const data = new FormData(event.target);

        const email = data.get('email'),
        re_email =  data.get('re_email');

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(change_email(email, re_email));
          }
      };

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
            title='Profile'
            content='User profile for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
                <div className='container-fluid py-3'>
                    <Heading text="User Profile" subtext={`${user.first_name} ${user.last_name}`} />
                </div>
           </div>

           <div className="p-3 p-md-5 bg-light rounded-3 mb-3">
                <h2>Settings</h2>
                <div className="accordion" id="profileSettingsAccordion">
                        <div className="accordion-item">
                            <h3 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Change Email
                            </button>
                            </h3>
                            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#profileSettingsAccordion">
                                <div className="accordion-body bg-light">
                                    <form onSubmit={handleChangeEmailSubmit}>
                                        <div className='form-group mb-3'>
                                            <label className='form-label mt-5' htmlFor='email'>
                                                <strong>New Email*</strong>
                                            </label>
                                            <input
                                                className='form-control'
                                                type='email'
                                                name='email'
                                                id='email'
                                                placeholder='New Email*'
                                                required
                                            />

                                            <label className='form-label mt-5' htmlFor='re_email'>
                                                <strong>Confirm New Email*</strong>
                                            </label>
                                            <input
                                                className='form-control'
                                                type='email'
                                                name='re_email'
                                                id='re_email'
                                                placeholder='Confirm New Email*'
                                                required
                                            />
                                        </div>

                                        <FormControlFeedback
                                            className="mb-3"
                                            message={change_email_message}
                                            success={change_email_success}
                                        />

                                        <button className='btn btn-primary' type='submit'>
                                            Change Email
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h3 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                Change Password
                            </button>
                            </h3>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#profileSettingsAccordion">
                                <div className="accordion-body bg-light">
                                    <form onSubmit={handleChangePasswordSubmit}>
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

                                        <FormControlFeedback
                                            className="mb-3"
                                            message={change_password_message}
                                            success={change_password_success}
                                        />

                                        <button className='btn btn-primary' type='submit'>
                                            Change Password
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
           </div>
        </Layout>
    );
};




export default Profile;