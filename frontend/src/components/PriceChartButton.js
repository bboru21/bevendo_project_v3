import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLineChart } from '@fortawesome/free-solid-svg-icons';
import css from './PriceChartButton.module.scss';

const PriceChartButton = ({
  className='',
  ...restProps
}) => {

  const [isOpen, setIsOpen ] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <button
      className={classNames(css.button, className, {
        [css.isOpen]: isOpen,
      })}
      onClick={handleClick}
      title={'View Pricing Data'}
      {...restProps}
    >
      <FontAwesomeIcon icon={faLineChart} size="2x" />
    </button>
  );
};


export default PriceChartButton;
