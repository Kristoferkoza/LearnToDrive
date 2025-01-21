
export interface ActiveUserData {
  id: string;
  login: string;
  roles: string[];
  permissions: string[];
  refreshTokenId?: string;
}