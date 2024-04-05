import { Oval } from 'react-loader-spinner';
import css from './Loader.module.scss';
import classNames from 'classnames';

const Loader = ({ overlay=false }) => {
  return (
    <div className={classNames(
      css.container, {
        [css.overlay]: overlay,
        ['opacity-75 bg-light']: overlay,
      }
    )}>
      <Oval
        type='Oval'
        color='#007bff'
        secondaryColor='#007bff'
        width={75}
        height={75}
        strokeWidth={6}
        wrapperClass={css.oval}
      />
    </div>
  );
};

export default Loader;