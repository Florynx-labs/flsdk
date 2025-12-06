# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-06

### Added

- Initial release of FarmLink SDK
- **FarmLinkClient** - Main client for API interactions
- **Authentication** - Support for API Key and OAuth Access Token
- **Fermes** - CRUD operations for farms
- **Parcelles** - CRUD operations for plots
- **Cultures** - CRUD operations for crops with status management
- **Transactions** - Budget management with summary endpoint
- **Inventory** - Stock management with low stock alerts
- **Error handling** - Typed error classes (AuthenticationError, RateLimitError, ValidationError, etc.)
- **TypeScript** - Full type definitions for all models and methods
- **Pagination** - Built-in pagination support for list operations
- **Debug mode** - Optional logging for debugging

### Features

- ESM and CommonJS support
- Tree-shakeable exports
- Zero runtime dependencies
- Node.js 16+ support
