import { createActionGroup, props } from '@ngrx/store';
import { FavoriteOffer } from '../../models/favorite.model';

export const FavoriteActions = createActionGroup({
  source: 'Favorite API',
  events: {
    'Load Favorites': props<{ userId: string | number }>(),
    'Load Favorites Success': props<{ favorites: FavoriteOffer[] }>(),
    'Load Favorites Failure': props<{ error: string }>(),

    'Add Favorite': props<{ favorite: Omit<FavoriteOffer, 'id'> }>(),
    'Add Favorite Success': props<{ favorite: FavoriteOffer }>(),
    'Add Favorite Failure': props<{ error: string }>(),

    'Remove Favorite': props<{ id: number }>(),
    'Remove Favorite Success': props<{ id: number }>(),
    'Remove Favorite Failure': props<{ error: string }>(),
  }
});
