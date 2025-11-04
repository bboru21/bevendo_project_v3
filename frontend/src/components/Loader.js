import { Oval } from 'react-loader-spinner';
import css from './Loader.module.scss';
import classNames from 'classnames';
import Image from 'next/image';

const Loader = ({ overlay=false }) => {
  return (
    <div className={classNames(
      css.container, {
        [css.overlay]: overlay,
        ['opacity-75 bg-light']: overlay,
      }
    )}>
      {/* <Oval
        type='Oval'
        color='#007bff'
        secondaryColor='#007bff'
        width={75}
        height={75}
        strokeWidth={6}
        wrapperClass={css.oval}
      /> */}
      <img 
        src='/loaders/loader-blue-813x813.gif?c=asdfads'
        className={css.oval} 
        alt='Bevendo' 
        width={150} 
        height={150} 
        priority
      />
    </div>
  );
};

export default Loader;