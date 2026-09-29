export type StatusType = 'ACTIVE' | 'INACTIVE';

export type UserRole = 'ADMIN' | 'MANAGER' | 'OWNER' | 'TENANT' | 'STAFF' | 'APARTMENT_MANAGER' | 'FINANCE_OFFICER';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export type SortDirection = 'asc' | 'desc';

export type RelationshipStatus =
  | 'OWNER'
  | 'TENANT'
  | 'STAFF'
  | 'RESIDENT'
  | 'NONE';

export interface PaginationParams {
  page: number;
  limit: number;
}
