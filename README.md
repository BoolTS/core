# BoolTS Core

BoolTS Core is a powerful TypeScript framework designed to provide essential building blocks for modern web applications. It offers a robust foundation with features like HTTP handling, data validation, and metadata reflection. This framework is built specifically for the Bun runtime environment.

## Features

-   **Bun Runtime**: Optimized for Bun's high-performance JavaScript runtime
-   **HTTP Handling**: Built-in support for HTTP requests and responses
-   **Data Validation**: Integration with Zod for type-safe data validation
-   **Metadata Reflection**: Support for runtime type information and metadata
-   **Decorators**: Rich set of decorators for extending functionality
-   **DateTime Handling**: Comprehensive date and time utilities
-   **Type Safety**: Full TypeScript support with strict type checking

## Prerequisites

-   [Bun](https://bun.sh/) (v1.0 or later)
-   Node.js (for development purposes)

## Installation

```bash
# Using bun
bun add @bool-ts/core
```

## Documentation

For detailed documentation, please visit [https://boolts.dev](https://boolts.dev)

## Quick Start

Create a new project with the following structure:

```typescript
// helloWorld.controller.ts
import { Controller, Get } from "@bool-ts/core";

@Controller()
export class HelloWorldController {
    @Get()
    sayHello() {
        return "Hello, world!";
    }
}
```

```typescript
// helloWorld.module.ts
import { Module } from "@bool-ts/core";
import { HelloWorldController } from "./helloWorld.controller";

@Module({
    controllers: [HelloWorldController]
})
export class HelloWorldModule {}
```

```typescript
// index.ts
import { BoolFactory } from "@bool-ts/core";
import { HelloWorldModule } from "./helloWorld.module";

BoolFactory(HelloWorldModule, {
    port: 3000
});
```

Run your application:

```bash
bun run index.ts
```

Your server will start at http://localhost:3000 and the endpoint will be available at http://localhost:3000/

## Core Components

### HTTP Module

Handle HTTP requests and responses with built-in routing and middleware support, optimized for Bun's HTTP server.

### Decorators

Extend your classes and methods with powerful decorators for:

-   Route handling
-   Parameter validation
-   Dependency injection
-   And more...

### Validation

Leverage Zod for robust data validation:

```typescript
import { z } from "zod";

const userSchema = z.object({
    name: z.string(),
    age: z.number().positive(),
    email: z.string().email()
});
```

### DateTime Utilities

Comprehensive date and time handling through `@bool-ts/date-time`:

```typescript
import { add as addTime, ETimeUnit } from "@bool-ts/date-time";

const targetDate = "2025-04-09";
const nextFiveDaysOfTargetDate = addTime(targetDate, 5, ETimeUnit.day);
```

## Project Structure

```
src/
├── decorators/    # Custom decorators
├── entities/      # Core entities
├── http/          # HTTP handling
├── interfaces/    # Type definitions
├── keys/          # Key constants
├── producers/     # Object producers
└── ultils/        # Utility functions
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

MIT © [Trần Đức Tâm (Neo)](https://github.com/tamneo)

## Support

For support, please open an issue in the [GitHub repository](https://github.com/BoolTS/core/issues).
