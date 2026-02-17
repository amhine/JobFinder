import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../../../core/store/selectors/favorite.selectors';
import { FavoriteActions } from '../../../core/store/actions/favorite.actions';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorite-list.html',
})
export class FavoriteList implements OnInit {
  private store = inject(Store);
  favorites$ = this.store.select(selectFavorites);

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.store.dispatch(FavoriteActions.loadFavorites({ userId: user.id }));
    }
  }

  deleteFav(id: number) {
    if (confirm('Bghiti t-suprimer had l-offre men favoris?')) {
      this.store.dispatch(FavoriteActions.removeFavorite({ id }));
    }
  }
}
