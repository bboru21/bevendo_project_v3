import {
  ADD_FAVORITE_SUCCESS,
  ADD_FAVORITE_FAIL,
  REMOVE_FAVORITE_SUCCESS,
  REMOVE_FAVORITE_FAIL,
} from './types';

export const add_favorite = (cocktail_id) => async dispatch => {

  const body = JSON.stringify({
    cocktail_id
  });

  try {
    const res = await fetch('/api/account/favorite', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await res.json();

    if (res.status === 200 || res.status === 201) {
      dispatch({
        type: ADD_FAVORITE_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ADD_FAVORITE_FAIL,
      })
    }
  } catch(error) {
    dispatch({
      type: ADD_FAVORITE_FAIL,
    })
  }
};

export const remove_favorite = (cocktail_id) => async dispatch => {

  const body = JSON.stringify({
    cocktail_id
  });

  try {
    const res = await fetch('/api/account/favorite', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch({
        type: REMOVE_FAVORITE_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: REMOVE_FAVORITE_FAIL,
      });
    }
  } catch(error) {
    dispatch({
      type: REMOVE_FAVORITE_FAIL,
    });
  }
};