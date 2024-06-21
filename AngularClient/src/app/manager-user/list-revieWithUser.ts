import { ListUser } from './list-user';

export interface ReviewWithUser {
  id: number;
  userId: number;
  description: string;
  reviewStar: number;
  user: ListUser | null;
}
