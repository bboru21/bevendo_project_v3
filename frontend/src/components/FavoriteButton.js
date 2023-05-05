import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import _ from 'underscore';
import { add_favorite, remove_favorite } from '../actions/user';
import { connect } from 'react-redux';

const FavoriteButton = ({
  favorites,
  cocktailId,
  className='',
}) => {

  const dispatch = useDispatch();

  const favoriteCocktailIds = favorites.map(obj => obj['cocktail']['pk']);
  const isFavorited = favoriteCocktailIds.indexOf(cocktailId) > -1;

  const handleClick = () => {
    if (isFavorited) {
      dispatch(remove_favorite(cocktailId));
    } else {
      dispatch(add_favorite(cocktailId));
    }
  };

  return (
    <button
      className={classNames("btn btn-sm btn-outline-secondary", className)}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={isFavorited ? faThumbsUp : faThumbsUpRegular} size="1x" />
    </button>
  );
};

const mapStateToProps = (state, ownProps) => ({
    favorites: _.get(state, ['auth', 'user', 'favorites'], []),
    ...ownProps,
});

export default connect(mapStateToProps)(FavoriteButton);
