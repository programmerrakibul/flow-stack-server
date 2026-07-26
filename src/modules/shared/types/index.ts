export type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data?: T;
  pagination?: TPagination;
};

export type TErrorResponse = {
  success: false;
  message: string;
};

export type TResponse<T = unknown> = TSuccessResponse<T> | TErrorResponse;
