import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../models/favorite.model';
import { FavoriteActions } from '../actions/favorite.actions';

export interface FavoriteState {
  favorites: FavoriteOffer[];
  loading: boolean;
  error: any;
}

export const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null
};

export const favoriteReducer = createReducer(
  initialState,
  on(FavoriteActions.loadFavorites, (state) => ({ ...state, loading: true })),
  on(FavoriteActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state, favorites, loading: false
  })),
  on(FavoriteActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite]
  })),
  on(FavoriteActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter(f => f.id !== id)
  }))
);
