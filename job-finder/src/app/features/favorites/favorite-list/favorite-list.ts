import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../../../core/store/selectors/favorite.selectors';
import { FavoriteActions } from '../../../core/store/actions/favorite.actions';

import { FavoriteOffer } from '../../../core/models/favorite.model';
import { Application } from '../../../core/models/application.model';

import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorite-list.html',
})
export class FavoriteList implements OnInit {
  private store = inject(Store);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);

  favorites$ = this.store.select(selectFavorites);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.store.dispatch(FavoriteActions.loadFavorites({ userId: userId }));
      }
    }
  }

  deleteFav(id: number) {
    if (confirm('Bghiti t-suprimer had l-offre men favoris?')) {
      this.store.dispatch(FavoriteActions.removeFavorite({ id }));
    }
  }


}
