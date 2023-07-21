import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLineChart } from '@fortawesome/free-solid-svg-icons';
import css from './PriceChartButton.module.scss';

const PriceChartButton = ({
  className='',
  onClick: onClickProp = () => {},
  ...restProps
}) => {

  const handleClick = (event) => {
    onClickProp(event);
  };

  return (
    <button
      className={classNames(css.button, className)}
      onClick={handleClick}
      title={'View Pricing Data'}
      {...restProps}
    >
      <FontAwesomeIcon icon={faLineChart} size="2x" />
    </button>
  );
};


export default PriceChartButton;
