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
        ['btn-outline-success']: !isFavorited,
        ['btn-success']: isFavorited,
      })}
      onClick={handleClick}
    >

      Favorite

      <FontAwesomeIcon icon={faThumbsUp} className="ms-2" size="1x" />
    </button>
  );
};

export default FavoriteButton;
