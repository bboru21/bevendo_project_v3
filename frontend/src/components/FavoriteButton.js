import { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const FavoriteButton = ({
  cocktailId,
  className='',
}) => {

  const user = useSelector(state => state.auth.user);

  const defaultIsFavorited = user.favorites.indexOf(cocktailId) > -1;
  const [isFavorited, setIsFavorited] = useState(defaultIsFavorited);

  const handleClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      className={classNames("btn btn-sm", className, {
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
