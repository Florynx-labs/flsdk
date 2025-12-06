/**
 * FarmLink SDK Error Classes
 */

export class FarmLinkError extends Error {
  public readonly status?: number
  public readonly code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'FarmLinkError'
    this.status = status
    this.code = code
    Object.setPrototypeOf(this, FarmLinkError.prototype)
  }
}

export class AuthenticationError extends FarmLinkError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class RateLimitError extends FarmLinkError {
  public readonly retryAfter?: number

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

export class ValidationError extends FarmLinkError {
  public readonly errors?: Record<string, string[]>

  constructor(message: string = 'Validation failed', errors?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    this.errors = errors
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends FarmLinkError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ForbiddenError extends FarmLinkError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
