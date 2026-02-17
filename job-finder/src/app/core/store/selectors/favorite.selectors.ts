import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState } from '../reducer/favorite.reducer';

export const selectFavoriteState = createFeatureSelector<FavoriteState>('favorite');

export const selectFavorites = createSelector(
  selectFavoriteState,
  (state) => state.favorites
);

export const selectIsLoading = createSelector(
  selectFavoriteState,
  (state) => state.loading
);
