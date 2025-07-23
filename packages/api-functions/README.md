# API Functions Package

Firebase Cloud Functions for the Kinben Unified Parts Reference System.

## Installation

```bash
pnpm install
```

## Building

```bash
pnpm build
```

## Development

```bash
pnpm dev
```

## Deployment

```bash
pnpm deploy
```

## Local Testing

```bash
pnpm serve
```

## Endpoints

- `GET /healthCheck` - Health check endpoint
- `GET /getComponents?category=<category>` - Get components by category
- `POST /addComponent` - Add new component
- `PUT /updateComponent?id=<id>` - Update component
- `DELETE /deleteComponent?id=<id>` - Delete component