# FarmLink SDK

Official Node.js SDK for the FarmLink API - The intelligent agricultural management platform.

[![npm version](https://badge.fury.io/js/farmlink-sdk.svg)](https://www.npmjs.com/package/farmlink-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @florynxlabs/farmlink-sdk
# or
yarn add @florynxlabs/farmlink-sdk
# or
pnpm add @florynxlabs/farmlink-sdk
```

## Quick Start

```typescript
import { FarmLinkClient } from '@florynxlabs/farmlink-sdk';

// Initialize with API Key
const farmlink = new FarmLinkClient({
  apiKey: 'fl_xxxxx_xxxxxxxxxxxxxxxx'
});

// Or with OAuth Access Token
const farmlink = new FarmLinkClient({
  accessToken: 'fla_xxxxxxxxxxxxxxxx'
});

// Get current user
const user = await farmlink.me();
console.log(`Hello, ${user.name}!`);

// List cultures
const { data: cultures } = await farmlink.cultures.list();
console.log(`You have ${cultures.length} cultures`);
```

## Authentication

### API Key

Get your API Key from [FarmLink Dashboard](https://farmlink.com/dashboard/parametres) → Developer → API Keys.

```typescript
const farmlink = new FarmLinkClient({
  apiKey: process.env.FARMLINK_API_KEY
});
```

### OAuth Access Token

For applications using FarmLink OAuth:

```typescript
const farmlink = new FarmLinkClient({
  accessToken: userAccessToken
});
```

## Configuration Options

```typescript
const farmlink = new FarmLinkClient({
  // Required: One of these
  apiKey: 'fl_xxxxx_xxxxxxxxxxxxxxxx',
  // OR
  accessToken: 'fla_xxxxxxxxxxxxxxxx',

  // Optional
  baseUrl: 'https://farmlink.com',  // Default
  timeout: 30000,                    // 30 seconds
  debug: false,                      // Enable debug logging
  headers: {                         // Custom headers
    'X-Custom-Header': 'value'
  }
});
```

## API Reference

### User

```typescript
// Get current user profile
const user = await farmlink.me();
```

### Fermes (Farms)

```typescript
// List all farms
const { data: fermes, pagination } = await farmlink.fermes.list({
  page: 1,
  limit: 20
});

// Get a specific farm
const ferme = await farmlink.fermes.get('ferme_id');

// Create a farm
const newFerme = await farmlink.fermes.create({
  nom: 'Ma Ferme',
  adresse: 'Bamako, Mali',
  superficie: 50
});

// Update a farm
const updated = await farmlink.fermes.update('ferme_id', {
  nom: 'Nouveau Nom'
});

// Delete a farm
await farmlink.fermes.delete('ferme_id');
```

### Parcelles (Plots)

```typescript
// List all plots
const { data: parcelles } = await farmlink.parcelles.list();

// Get a specific plot
const parcelle = await farmlink.parcelles.get('parcelle_id');

// Create a plot
const newParcelle = await farmlink.parcelles.create({
  nom: 'Parcelle Nord',
  superficie: 10,
  typeSol: 'Argileux',
  statut: 'ACTIVE',
  fermeId: 'ferme_id'
});

// Update a plot
await farmlink.parcelles.update('parcelle_id', {
  statut: 'EN_JACHERE'
});

// Delete a plot
await farmlink.parcelles.delete('parcelle_id');
```

### Cultures (Crops)

```typescript
// List all crops
const { data: cultures } = await farmlink.cultures.list({
  statut: 'CROISSANCE',
  parcelleId: 'parcelle_id'
});

// Get a specific crop
const culture = await farmlink.cultures.get('culture_id');

// Create a crop
const newCulture = await farmlink.cultures.create({
  nom: 'Maïs',
  variete: 'Hybride',
  dateDebut: '2024-03-15',
  statut: 'SEMIS',
  rendementEstime: 5000,
  parcelleId: 'parcelle_id'
});

// Update crop status
await farmlink.cultures.updateStatus('culture_id', 'CROISSANCE');

// Update a crop
await farmlink.cultures.update('culture_id', {
  rendementReel: 4800,
  notes: 'Bonne récolte'
});

// Delete a crop
await farmlink.cultures.delete('culture_id');
```

### Transactions (Budget)

```typescript
// List transactions
const { data: transactions } = await farmlink.transactions.list({
  type: 'DEPENSE',
  categorie: 'SEMENCES',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31'
});

// Get budget summary
const summary = await farmlink.transactions.getSummary({
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31'
});
console.log(`Revenus: ${summary.revenus}, Dépenses: ${summary.depenses}`);

// Create a transaction
const transaction = await farmlink.transactions.create({
  type: 'DEPENSE',
  libelle: 'Achat semences maïs',
  montant: 50000,
  categorie: 'SEMENCES',
  description: '10kg de semences hybrides'
});

// Update a transaction
await farmlink.transactions.update('transaction_id', {
  montant: 55000
});

// Delete a transaction
await farmlink.transactions.delete('transaction_id');
```

### Inventory

```typescript
// List inventory
const { data: items } = await farmlink.inventory.list({
  categorie: 'SEMENCES',
  lowStock: true
});

// Get low stock items
const lowStock = await farmlink.inventory.getLowStock();

// Create an item
const item = await farmlink.inventory.create({
  nom: 'Engrais NPK',
  categorie: 'ENGRAIS',
  quantite: 100,
  unite: 'kg',
  prixUnitaire: 500,
  seuilAlerte: 20
});

// Adjust quantity
await farmlink.inventory.adjustQuantity('item_id', -10, 'Utilisé pour parcelle Nord');

// Update an item
await farmlink.inventory.update('item_id', {
  prixUnitaire: 550
});

// Delete an item
await farmlink.inventory.delete('item_id');
```

## Error Handling

```typescript
import { 
  FarmLinkClient, 
  FarmLinkError,
  AuthenticationError,
  RateLimitError,
  ValidationError 
} from '@florynxlabs/farmlink-sdk';

try {
  const cultures = await farmlink.cultures.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid credentials');
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.errors);
  } else if (error instanceof FarmLinkError) {
    console.error(`API Error: ${error.message} (${error.status})`);
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

```typescript
import type { 
  Culture, 
  CultureStatut,
  Transaction,
  InventoryItem,
  PaginatedResponse 
} from '@florynxlabs/farmlink-sdk';

const handleCultures = (response: PaginatedResponse<Culture>) => {
  response.data.forEach(culture => {
    console.log(culture.nom, culture.statut);
  });
};
```

## Pagination

All list methods return paginated responses:

```typescript
const response = await farmlink.cultures.list({
  page: 1,
  limit: 20,
  sort: 'createdAt',
  order: 'desc'
});

console.log(`Page ${response.pagination.page} of ${response.pagination.totalPages}`);
console.log(`Total items: ${response.pagination.total}`);
```

## Debug Mode

Enable debug logging to see all API requests:

```typescript
const farmlink = new FarmLinkClient({
  apiKey: 'your_api_key',
  debug: true
});

// Logs: [FarmLink SDK] GET https://farmlink.com/api/v1/cultures
```

## Links

- [FarmLink Website](https://farmlink.com)
- [API Documentation](https://farmlink.com/docs/api)
- [OAuth Guide](https://farmlink.com/docs/authentication)
- [GitHub Repository](https://github.com/farmlink/farmlink-sdk)

## License

MIT © [Florynx Labs](https://florynxlabs.com)
