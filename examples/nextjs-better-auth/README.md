# Farmlink SDK + Better Auth + Next.js

This example demonstrates how to integrate the Farmlink SDK with [Better Auth](https://better-auth.com) in a Next.js application.

## Setup

1. Install dependencies:
```bash
npm install @florynxlabs/farmlink-sdk better-auth
```

2. Configure your environment variables in `.env.local`:
```env
FARMLINK_CLIENT_ID=your_client_id
FARMLINK_CLIENT_SECRET=your_client_secret
BETTER_AUTH_SECRET=your_better_auth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Create your auth configuration (see `lib/auth.ts`).

4. Use the Farmlink SDK with the access token from the session.

## Why this integration?

- **Zero Configuration**: One line setup with `farmlinkProvider`.
- **Automatic Mapping**: Farmlink profile fields (id, name, email, avatar) are automatically mapped to Better Auth user fields.
- **Unified Bearer Auth**: Use the SDK seamlessly with the tokens provided by Better Auth.

## Links

- [Farmlink Website](https://farmlinkmali.com)
- [SDK Documentation](https://farmlinkmali.com/docs/sdk)
