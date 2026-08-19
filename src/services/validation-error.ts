export interface ValidationErrorResponse {
  status: number;
  errors: Record<string, string>;
}