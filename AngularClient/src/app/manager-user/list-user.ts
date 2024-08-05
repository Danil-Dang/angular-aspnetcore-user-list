export interface ListUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  isActive: boolean;
  createdDate: Date;
  createdDateFormatted?: string | null;
}
