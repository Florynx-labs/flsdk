/**
 * FarmLink SDK Types
 */

// ============ Configuration ============

export interface FarmLinkConfig {
  /** API Key (format: fl_xxxxx_xxxxxxxx) */
  apiKey?: string
  /** OAuth Access Token */
  accessToken?: string
  /** Base URL for the API (default: https://farmlink.com) */
  baseUrl?: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
  /** Custom headers to include in requests */
  headers?: Record<string, string>
  /** Enable debug logging */
  debug?: boolean
}

// ============ API Response Types ============

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  error_description?: string
  status?: number
}

// ============ User ============

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

// ============ Ferme ============

export interface Ferme {
  id: string
  nom: string
  adresse?: string
  superficie?: number
  description?: string
  latitude?: number
  longitude?: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateFermeInput {
  nom: string
  adresse?: string
  superficie?: number
  description?: string
  latitude?: number
  longitude?: number
}

export interface UpdateFermeInput extends Partial<CreateFermeInput> {}

// ============ Parcelle ============

export interface Parcelle {
  id: string
  nom: string
  superficie: number
  typeSol?: string
  statut: 'ACTIVE' | 'EN_JACHERE' | 'EN_PREPARATION'
  fermeId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateParcelleInput {
  nom: string
  superficie: number
  typeSol?: string
  statut?: 'ACTIVE' | 'EN_JACHERE' | 'EN_PREPARATION'
  fermeId?: string
}

export interface UpdateParcelleInput extends Partial<CreateParcelleInput> {}

// ============ Culture ============

export type CultureStatut = 'SEMIS' | 'CROISSANCE' | 'FLORAISON' | 'RECOLTE' | 'TERMINE'

export interface Culture {
  id: string
  nom: string
  variete?: string
  dateDebut: string
  dateFin?: string
  statut: CultureStatut
  rendementEstime?: number
  rendementReel?: number
  notes?: string
  parcelleId: string
  userId: string
  createdAt: string
  updatedAt: string
  parcelle?: Parcelle
}

export interface CreateCultureInput {
  nom: string
  variete?: string
  dateDebut: string
  dateFin?: string
  statut?: CultureStatut
  rendementEstime?: number
  notes?: string
  parcelleId: string
}

export interface UpdateCultureInput extends Partial<CreateCultureInput> {}

// ============ Budget / Transactions ============

export type TransactionType = 'REVENU' | 'DEPENSE'

export type TransactionCategory =
  | 'SEMENCES'
  | 'ENGRAIS'
  | 'PESTICIDES'
  | 'EQUIPEMENT'
  | 'MAIN_OEUVRE'
  | 'CARBURANT'
  | 'EAU'
  | 'ELECTRICITE'
  | 'TRANSPORT'
  | 'VENTE_RECOLTE'
  | 'SUBVENTION'
  | 'AUTRE'

export interface Transaction {
  id: string
  type: TransactionType
  libelle: string
  montant: number
  categorie: TransactionCategory
  description?: string
  date: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  type: TransactionType
  libelle: string
  montant: number
  categorie: TransactionCategory
  description?: string
  date?: string
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

// ============ Inventaire ============

export type InventoryCategory =
  | 'SEMENCES'
  | 'ENGRAIS'
  | 'PESTICIDES'
  | 'OUTILS'
  | 'EQUIPEMENT'
  | 'CARBURANT'
  | 'AUTRE'

export interface InventoryItem {
  id: string
  nom: string
  categorie: InventoryCategory
  quantite: number
  unite: string
  prixUnitaire?: number
  seuilAlerte?: number
  fournisseur?: string
  dateExpiration?: string
  notes?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateInventoryInput {
  nom: string
  categorie: InventoryCategory
  quantite: number
  unite: string
  prixUnitaire?: number
  seuilAlerte?: number
  fournisseur?: string
  dateExpiration?: string
  notes?: string
}

export interface UpdateInventoryInput extends Partial<CreateInventoryInput> {}

// ============ Query Parameters ============

export interface ListParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface CultureListParams extends ListParams {
  statut?: CultureStatut
  parcelleId?: string
}

export interface TransactionListParams extends ListParams {
  type?: TransactionType
  categorie?: TransactionCategory
  dateFrom?: string
  dateTo?: string
}

export interface InventoryListParams extends ListParams {
  categorie?: InventoryCategory
  lowStock?: boolean
}
