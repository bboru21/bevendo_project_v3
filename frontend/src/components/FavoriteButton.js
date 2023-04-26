import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'underscore';

const FavoriteButton = ({
  cocktailId,
  className='',
}) => {

  const user = useSelector(state => state.auth.user);

  const favorites = useRef([]);
  // useEffect(() => {
  //   favorites.current = _.get(user, 'favorites', []).map(obj => obj['cocktail']);
  // }, [user]);

  const handleClick = () => {
    // setIsFavorited(!isFavorited);
  };

  // const isFavorited = favorites.current.indexOf(cocktailId) > -1;
  const isFavorited = false;
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
