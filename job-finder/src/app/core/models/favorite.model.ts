export interface FavoriteOffer {
  id: number;
  userId: number | string;
  offerId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  created_at: number;
  tags: string[];
}
