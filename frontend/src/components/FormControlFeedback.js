import css from './FormControlFeedback.module.scss';
import classNames from 'classnames';

const FormControlFeedback = ({ message, success, className='' }) => {

  return (
    <div
      className={classNames(css.container, className, {
        ['text-success']: success===true,
        ['text-danger']: success===false,
        [css.visible]: message!==null,
      })}
    >
      {message || '[Placeholder]'}
    </div>
  );
};

export default FormControlFeedback;