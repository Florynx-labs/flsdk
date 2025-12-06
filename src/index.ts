/**
 * FarmLink SDK v1.0.0
 * Official SDK for the FarmLink API
 * 
 * @author Florynx Labs
 * @license MIT
 */

// Main client
export { FarmLinkClient } from './client'

// Error classes
export { 
  FarmLinkError, 
  AuthenticationError, 
  RateLimitError, 
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from './errors'

// Types
export type {
  // Config
  FarmLinkConfig,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  
  // User
  User,
  
  // Ferme
  Ferme,
  CreateFermeInput,
  UpdateFermeInput,
  
  // Parcelle
  Parcelle,
  CreateParcelleInput,
  UpdateParcelleInput,
  
  // Culture
  Culture,
  CultureStatut,
  CreateCultureInput,
  UpdateCultureInput,
  
  // Transaction
  Transaction,
  TransactionType,
  TransactionCategory,
  CreateTransactionInput,
  UpdateTransactionInput,
  
  // Inventory
  InventoryItem,
  InventoryCategory,
  CreateInventoryInput,
  UpdateInventoryInput,
  
  // Query params
  ListParams,
  CultureListParams,
  TransactionListParams,
  InventoryListParams,
} from './types'

// Default export
export { FarmLinkClient as default } from './client'
