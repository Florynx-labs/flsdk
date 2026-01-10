/**
 * FarmLink SDK Client
 */

import {
  FarmLinkConfig,
  User,
  Ferme,
  Parcelle,
  Culture,
  Transaction,
  InventoryItem,
  PaginatedResponse,
  CreateFermeInput,
  UpdateFermeInput,
  CreateParcelleInput,
  UpdateParcelleInput,
  CreateCultureInput,
  UpdateCultureInput,
  CreateTransactionInput,
  UpdateTransactionInput,
  CreateInventoryInput,
  UpdateInventoryInput,
  ListParams,
  CultureListParams,
  TransactionListParams,
  InventoryListParams,
  DashboardStats,
  MarketplaceAd,
  MarketplaceListParams,
} from './types'

import {
  FarmLinkError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from './errors'

const DEFAULT_BASE_URL = 'https://farmlinkmali.com'
const DEFAULT_TIMEOUT = 30000

export class FarmLinkClient {
  private readonly config: Required<Pick<FarmLinkConfig, 'baseUrl' | 'timeout' | 'debug'>> & FarmLinkConfig

  // Resource clients
  public readonly fermes: FermesClient
  public readonly parcelles: ParcellesClient
  public readonly cultures: CulturesClient
  public readonly transactions: TransactionsClient
  public readonly inventory: InventoryClient
  public readonly analytics: AnalyticsClient
  public readonly marketplace: MarketplaceClient

  constructor(config: FarmLinkConfig) {
    if (!config.apiKey && !config.accessToken) {
      throw new AuthenticationError('Either apiKey or accessToken is required')
    }

    this.config = {
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      debug: config.debug || false,
      ...config,
    }

    // Initialize resource clients
    this.fermes = new FermesClient(this)
    this.parcelles = new ParcellesClient(this)
    this.cultures = new CulturesClient(this)
    this.transactions = new TransactionsClient(this)
    this.inventory = new InventoryClient(this)
    this.analytics = new AnalyticsClient(this)
    this.marketplace = new MarketplaceClient(this)
  }

  /**
   * Get current user profile
   */
  async me(): Promise<User> {
    return this.request<User>('GET', '/api/v1/me')
  }

  /**
   * Make an authenticated request to the FarmLink API with automatic retries for rate limits
   */
  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown
      params?: Record<string, unknown>
      retries?: number
    }
  ): Promise<T> {
    const maxRetries = options?.retries ?? 3
    let attempt = 0

    const execute = async (): Promise<T> => {
      const url = new URL(path, this.config.baseUrl)

      // Add query parameters
      if (options?.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.set(key, String(value))
          }
        })
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...this.config.headers,
      }

      // Add authentication
      if (this.config.apiKey) {
        headers['X-API-Key'] = this.config.apiKey
      } else if (this.config.accessToken) {
        headers['Authorization'] = `Bearer ${this.config.accessToken}`
      }

      if (this.config.debug) {
        console.log(`[FarmLink SDK] ${method} ${url.toString()} (Attempt ${attempt + 1})`)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      try {
        const response = await fetch(url.toString(), {
          method,
          headers,
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle rate limiting with automatic retry
        if (response.status === 429 && attempt < maxRetries) {
          attempt++
          const retryAfter = response.headers.get('Retry-After')
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000

          if (this.config.debug) {
            console.warn(`[FarmLink SDK] Rate limit hit. Retrying in ${delay}ms...`)
          }

          await new Promise((resolve) => setTimeout(resolve, delay))
          return execute()
        }

        // Handle error responses
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          throw new RateLimitError(
            'Rate limit exceeded',
            retryAfter ? parseInt(retryAfter, 10) : undefined
          )
        }

        if (response.status === 401) {
          throw new AuthenticationError('Invalid or expired credentials')
        }

        if (response.status === 403) {
          throw new ForbiddenError('Insufficient permissions')
        }

        if (response.status === 404) {
          throw new NotFoundError()
        }

        // Parse response
        const data = await response.json() as Record<string, unknown>

        // Handle validation errors
        if (response.status === 400) {
          throw new ValidationError(
            (data.error as string) || 'Validation failed',
            data.errors as Record<string, string[]> | undefined
          )
        }

        // Handle other errors
        if (!response.ok) {
          throw new FarmLinkError(
            (data.error as string) || 'Request failed',
            response.status,
            data.code as string | undefined
          )
        }

        return data as T
      } catch (error) {
        clearTimeout(timeoutId)

        if (error instanceof FarmLinkError) {
          throw error
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new FarmLinkError('Request timeout', 408, 'TIMEOUT')
          }
          throw new FarmLinkError(error.message)
        }

        throw new FarmLinkError('Unknown error occurred')
      }
    }

    return execute()
  }
}

// ============ Resource Clients ============

class FermesClient {
  constructor(private client: FarmLinkClient) { }

  async list(params?: ListParams): Promise<PaginatedResponse<Ferme>> {
    return this.client.request('GET', '/api/v1/fermes', { params })
  }

  async get(id: string): Promise<Ferme> {
    return this.client.request('GET', `/api/v1/fermes/${id}`)
  }

  async create(data: CreateFermeInput): Promise<Ferme> {
    return this.client.request('POST', '/api/v1/fermes', { body: data })
  }

  async update(id: string, data: UpdateFermeInput): Promise<Ferme> {
    return this.client.request('PUT', `/api/v1/fermes/${id}`, { body: data })
  }

  async delete(id: string): Promise<void> {
    return this.client.request('DELETE', `/api/v1/fermes/${id}`)
  }
}

class ParcellesClient {
  constructor(private client: FarmLinkClient) { }

  async list(params?: ListParams): Promise<PaginatedResponse<Parcelle>> {
    return this.client.request('GET', '/api/v1/parcelles', { params })
  }

  async get(id: string): Promise<Parcelle> {
    return this.client.request('GET', `/api/v1/parcelles/${id}`)
  }

  async create(data: CreateParcelleInput): Promise<Parcelle> {
    return this.client.request('POST', '/api/v1/parcelles', { body: data })
  }

  async update(id: string, data: UpdateParcelleInput): Promise<Parcelle> {
    return this.client.request('PUT', `/api/v1/parcelles/${id}`, { body: data })
  }

  async delete(id: string): Promise<void> {
    return this.client.request('DELETE', `/api/v1/parcelles/${id}`)
  }
}

class CulturesClient {
  constructor(private client: FarmLinkClient) { }

  async list(params?: CultureListParams): Promise<PaginatedResponse<Culture>> {
    return this.client.request('GET', '/api/v1/cultures', { params })
  }

  async get(id: string): Promise<Culture> {
    return this.client.request('GET', `/api/v1/cultures/${id}`)
  }

  async create(data: CreateCultureInput): Promise<Culture> {
    return this.client.request('POST', '/api/v1/cultures', { body: data })
  }

  async update(id: string, data: UpdateCultureInput): Promise<Culture> {
    return this.client.request('PUT', `/api/v1/cultures/${id}`, { body: data })
  }

  async delete(id: string): Promise<void> {
    return this.client.request('DELETE', `/api/v1/cultures/${id}`)
  }

  async updateStatus(id: string, statut: Culture['statut']): Promise<Culture> {
    return this.client.request('PATCH', `/api/v1/cultures/${id}/status`, {
      body: { statut },
    })
  }
}

class TransactionsClient {
  constructor(private client: FarmLinkClient) { }

  async list(params?: TransactionListParams): Promise<PaginatedResponse<Transaction>> {
    return this.client.request('GET', '/api/v1/transactions', { params })
  }

  async get(id: string): Promise<Transaction> {
    return this.client.request('GET', `/api/v1/transactions/${id}`)
  }

  async create(data: CreateTransactionInput): Promise<Transaction> {
    return this.client.request('POST', '/api/v1/transactions', { body: data })
  }

  async update(id: string, data: UpdateTransactionInput): Promise<Transaction> {
    return this.client.request('PUT', `/api/v1/transactions/${id}`, { body: data })
  }

  async delete(id: string): Promise<void> {
    return this.client.request('DELETE', `/api/v1/transactions/${id}`)
  }

  async getSummary(params?: { dateFrom?: string; dateTo?: string }): Promise<{
    revenus: number
    depenses: number
    solde: number
    count: number
  }> {
    return this.client.request('GET', '/api/v1/transactions/summary', { params })
  }
}

class InventoryClient {
  constructor(private client: FarmLinkClient) { }

  async list(params?: InventoryListParams): Promise<PaginatedResponse<InventoryItem>> {
    return this.client.request('GET', '/api/v1/inventaire', { params })
  }

  async get(id: string): Promise<InventoryItem> {
    return this.client.request('GET', `/api/v1/inventaire/${id}`)
  }

  async create(data: CreateInventoryInput): Promise<InventoryItem> {
    return this.client.request('POST', '/api/v1/inventaire', { body: data })
  }

  async update(id: string, data: UpdateInventoryInput): Promise<InventoryItem> {
    return this.client.request('PUT', `/api/v1/inventaire/${id}`, { body: data })
  }

  async delete(id: string): Promise<void> {
    return this.client.request('DELETE', `/api/v1/inventaire/${id}`)
  }

  async adjustQuantity(id: string, adjustment: number, reason?: string): Promise<InventoryItem> {
    return this.client.request('PATCH', `/api/v1/inventaire/${id}/adjust`, {
      body: { adjustment, reason },
    })
  }

  async getLowStock(): Promise<InventoryItem[]> {
    const response = await this.list({ lowStock: true })
    return response.data
  }
}

class AnalyticsClient {
  constructor(private client: FarmLinkClient) { }

  /**
   * Get global dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    return this.client.request('GET', '/api/v1/dashboard/stats')
  }
}

class MarketplaceClient {
  constructor(private client: FarmLinkClient) { }

  /**
   * List marketplace advertisements with optional filtering
   */
  async listAds(params?: MarketplaceListParams): Promise<PaginatedResponse<MarketplaceAd>> {
    return this.client.request('GET', '/api/v1/marketplace/ads', { params })
  }

  /**
   * Get a specific marketplace advertisement by ID
   */
  async getAd(id: string): Promise<MarketplaceAd> {
    return this.client.request('GET', `/api/v1/marketplace/ads/${id}`)
  }
}
