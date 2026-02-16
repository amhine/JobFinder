import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';


@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorite-list.html',
})
export class FavoriteList implements OnInit {
  favorites: any[] = [];

  constructor(private FavoriteService: FavoriteService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.FavoriteService.getFavorites();
  }

  removeFavorite(slug: string) {
    this.FavoriteService.removeFromFavorites(slug);
    this.loadFavorites();
  }
}
