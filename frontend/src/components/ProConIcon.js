import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';


const ProConIcon = ({isPro, className='', ...restProps}) => {
  return isPro ? (
    <FontAwesomeIcon
      icon={faCheck}
      className={classNames(className, "text-success")}
      {...restProps}
    />
  ) : (
    <FontAwesomeIcon
      icon={faTimes}
      className={classNames(className, "text-danger")}
      {...restProps}
    />
  );
}

export default ProConIcon;