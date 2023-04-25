import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const FavoriteButton = ({
  className='',
}) => {

  const [isFavorited, setIsFavorited] = useState(false);

  const handleClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      className={classNames("btn", className, {
        ['btn-outline-secondary']: !isFavorited,
        ['btn-secondary']: isFavorited,
      })}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faThumbsUp} size="1x" />
    </button>
  );
};

export default FavoriteButton;
