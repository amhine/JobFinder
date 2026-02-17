import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core'; import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  favorites$ = this.store.select(selectFavorites);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('userId');
      if (userStr) {
        this.store.dispatch(FavoriteActions.loadFavorites({ userId: userStr }));
      }
    }
  }

  deleteFav(id: number) {
    if (confirm('Bghiti t-suprimer had l-offre men favoris?')) {
      this.store.dispatch(FavoriteActions.removeFavorite({ id }));
    }
  }
}
