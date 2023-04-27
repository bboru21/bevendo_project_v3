import { Oval as Loader } from 'react-loader-spinner';
import css from './LoadingOverlay.module.css';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

const LoadingOverlay = () => {

  const loading = useSelector(state => state.auth.loading);

  return (
    <div className={classNames(css.container, {
      [css.loading]: loading,
    })}>
      <Loader
          type='Oval'
          color='#00bfff'
          width={100}
          height={100}
      />
    </div>
  );
};

export default LoadingOverlay;