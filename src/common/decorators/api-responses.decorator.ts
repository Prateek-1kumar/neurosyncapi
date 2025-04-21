import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Common API responses for protected endpoints
 */
export function ApiProtectedResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Token is valid but lacks required permissions',
    }),
  );
}

/**
 * Common API responses for CRUD operations
 */
export function ApiCrudResponses(options: {
  successStatus?: number;
  successDescription?: string;
  dataType?: any;
  includeNotFoundResponse?: boolean;
}) {
  const {
    successStatus = 200,
    successDescription = 'Operation successful',
    dataType,
    includeNotFoundResponse = false,
  } = options;

  const decorators = [
    ApiResponse({
      status: successStatus,
      description: successDescription,
      type: dataType,
    }),
    ApiProtectedResponses(),
  ];

  if (includeNotFoundResponse) {
    decorators.push(
      ApiResponse({
        status: 404,
        description: 'Not Found - The requested resource was not found',
      }),
    );
  }

  return applyDecorators(...decorators);
}
