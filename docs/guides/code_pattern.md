# Code Pattern Documentation

## Overview

This document outlines the code patterns and architectural guidelines for the ICT-MEETUP-API project. The project uses  **TypeORM** ,  **Express.js** ,  **Zod** , and follows **OOP principles** for services with **functional patterns** for controllers and routing.

## Table of Contents

* [Project Structure](#project-structure)
* [Layer Architecture](#layer-architecture)
* [Naming Conventions](#naming-conventions)
* [Response Format](#response-format)
* [Best Practices](#best-practices)

---

## Project Structure

```
src/modules/events/
├── controllers/
├── dto/
├── entities/
├── repositories/
├── routes/   
└── services/
└── errors/
├── shared/
│   ├── errors/
│   │   └── app.error.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   └── utils/
└── index.ts
```

---

## Layer Architecture

### 1. Entity Layer

 **Purpose** : Define database models using TypeORM decorators

 **Location** : `src/modules/{module}/entities/`

 **Pattern** :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  propertyName: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

 **Rules** :

* Use decorators for all columns
* Always include `createdAt` and `updatedAt` timestamps
* Use meaningful table and column names
* Keep entities pure (no business logic)

---

### 2. DTO Layer

 **Purpose** : Define data transfer objects with Zod validation schemas

 **Location** : `src/modules/{module}/dto/`

 **Pattern** :

```typescript
import { z } from 'zod';

export const createEntitySchema = z.object({
  propertyName: z.string().min(3).max(255),
  age: z.number().int().positive(),
  email: z.string().email(),
});

export const updateEntitySchema = createEntitySchema.partial();

export const entityIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateEntityDto = z.infer<typeof createEntitySchema>;
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>;
```

 **Rules** :

* Define separate schemas for create, update, and params
* Use `.partial()` for update schemas
* Export both schema and inferred types
* Add meaningful validation rules

---

### 3. Repository Layer

 **Purpose** : Handle database operations and queries

 **Location** : `src/modules/{module}/repositories/`

 **Pattern** :

```typescript
import { Repository, DataSource } from 'typeorm';
import { Entity } from '../entities/entity.entity';
import { IEntityRepository } from '../interfaces/entity.interface';

export class EntityRepository implements IEntityRepository {
  private repository: Repository<Entity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Entity);
  }

  async save(entity: Entity): Promise<Entity> {
    return await this.repository.save(entity);
  }

  async findAll(skip: number, take: number): Promise<[Entity[], number]> {
    return await this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Entity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Entity>): Promise<Entity> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Entity not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

 **Rules** :

* Use OOP class pattern
* Inject DataSource through constructor
* Implement repository interface
* No business logic (only data operations)
* Always handle null/undefined cases

---

### 4. Service Layer

 **Purpose** : Implement business logic

 **Location** : `src/modules/{module}/services/`

 **Pattern** :

```typescript
import { Entity } from '../entities/entity.entity';
import { CreateEntityDto, UpdateEntityDto } from '../dto/entity.dto';
import { IEntityService, IEntityRepository } from '../interfaces/entity.interface';
import { AppError } from '../../../shared/errors/app.error';

export class EntityService implements IEntityService {
  constructor(private readonly entityRepository: IEntityRepository) {}

  async create(data: CreateEntityDto): Promise<Entity> {
    // Business logic validation
    this.validateBusinessRules(data);

    const entity = Object.assign(new Entity(), data);
    return await this.entityRepository.save(entity);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Entity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.entityRepository.findAll(skip, limit);
    return { data, total };
  }

  async findById(id: string): Promise<Entity> {
    const entity = await this.entityRepository.findById(id);
    if (!entity) {
      throw new AppError('Entity not found', 404);
    }
    return entity;
  }

  async update(id: string, data: UpdateEntityDto): Promise<Entity> {
    await this.findById(id);
    return await this.entityRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.entityRepository.delete(id);
  }

  private validateBusinessRules(data: CreateEntityDto): void {
    // Add business validation logic
  }
}
```

 **Rules** :

* Use OOP class pattern
* Inject dependencies through constructor
* Implement service interface
* All business logic goes here
* Throw `AppError` for expected errors
* Use private methods for internal logic

---

### 5. Controller Layer

 **Purpose** : Handle HTTP requests and responses

 **Location** : `src/modules/{module}/controllers/`

 **Pattern** :

```typescript
import { Request, Response, NextFunction } from 'express';
import { EntityService } from '../services/entity.service';
import { createEntitySchema, updateEntitySchema, entityIdSchema } from '../dto/entity.dto';

export const createEntityController = (entityService: EntityService) => {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedData = createEntitySchema.parse(req.body);
        const entity = await entityService.create(validatedData);
    
        return res.status(201).json({
          success: true,
          message: 'Entity created successfully',
          data: entity,
        });
      } catch (error) {
        next(error);
      }
    },

    findAll: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        const result = await entityService.findAll(page, limit);
    
        return res.status(200).json({
          success: true,
          message: 'Entities retrieved successfully',
          data: result.data,
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
          },
        });
      } catch (error) {
        next(error);
      }
    },

    findById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = entityIdSchema.parse(req.params);
        const entity = await entityService.findById(id);
    
        return res.status(200).json({
          success: true,
          message: 'Entity retrieved successfully',
          data: entity,
        });
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = entityIdSchema.parse(req.params);
        const validatedData = updateEntitySchema.parse(req.body);
        const entity = await entityService.update(id, validatedData);
    
        return res.status(200).json({
          success: true,
          message: 'Entity updated successfully',
          data: entity,
        });
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = entityIdSchema.parse(req.params);
        await entityService.delete(id);
    
        return res.status(200).json({
          success: true,
          message: 'Entity deleted successfully',
        });
      } catch (error) {
        next(error);
      }
    },
  };
};
```

 **Rules** :

* Use functional pattern (factory function returning object)
* Accept service as parameter
* Always wrap in try-catch
* Pass errors to `next()`
* Validate request data using Zod schemas
* Return consistent response format
* Use appropriate HTTP status codes

---

### 6. Validator Layer

 **Purpose** : Middleware for request validation

 **Location** : `src/modules/{module}/validators/`

 **Pattern** :

```typescript
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { AppError } from '../../../shared/errors/app.error';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError('Validation failed', 400, errors);
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid parameters', 400, error.errors);
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid query parameters', 400, error.errors);
      }
      next(error);
    }
  };
};
```

 **Rules** :

* Create separate validators for body, params, and query
* Use Zod for validation
* Throw AppError with validation details
* Always call `next()` for success or error

---

### 7. Router Layer

 **Purpose** : Define API routes and wire up dependencies

 **Location** : `src/modules/{module}/{module}.routes.ts`

 **Pattern** :

```typescript
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { EntityRepository } from './repositories/entity.repository';
import { EntityService } from './services/entity.service';
import { createEntityController } from './controllers/entity.controller';
import { validateRequest, validateParams } from './validators/entity.validator';
import { createEntitySchema, updateEntitySchema, entityIdSchema } from './dto/entity.dto';

 
const router = Router();
  // Routes
  router.post(
    '/',
    validateRequest(createEntitySchema),
    entityController.create
  );

  router.get('/', entityController.findAll);

  router.get(
    '/:id',
    validateParams(entityIdSchema),
    entityController.findById
  );

  router.put(
    '/:id',
    validateParams(entityIdSchema),
    validateRequest(updateEntitySchema),
    entityController.update
  );

  router.delete(
    '/:id',
    validateParams(entityIdSchema),
    entityController.delete
  );

 
```

 **Rules** :

* Use factory function that accepts DataSource
* Initialize all dependencies in router
* Apply validation middleware before controllers
* Use RESTful route patterns
* Return Router instance

---

## Naming Conventions

### Files

* **Entities** : `{entity-name}.entity.ts` (e.g., `event.entity.ts`)
* **DTOs** : `{entity-name}.dto.ts` (e.g., `event.dto.ts`)
* **Interfaces** : `{entity-name}.interface.ts` (e.g., `event.interface.ts`)
* **Repositories** : `{entity-name}.repository.ts` (e.g., `event.repository.ts`)
* **Services** : `{entity-name}.service.ts` (e.g., `event.service.ts`)
* **Controllers** : `{entity-name}.controller.ts` (e.g., `event.controller.ts`)
* **Validators** : `{entity-name}.validator.ts` (e.g., `event.validator.ts`)
* **Routes** : `{module-name}.routes.ts` (e.g., `events.routes.ts`)

### Classes and Interfaces

* **Entities** : PascalCase (e.g., `Event`, `User`)
* **Services** : `{Entity}Service` (e.g., `EventService`)
* **Repositories** : `{Entity}Repository` (e.g., `EventRepository`)
* **Interfaces** : `I{Entity}Service`, `I{Entity}Repository` (e.g., `IEventService`)

### Functions and Variables

* **Controllers** : `create{Entity}Controller` (e.g., `createEventController`)
* **Routers** : `create{Entity}Router` (e.g., `createEventRouter`)
* **Variables** : camelCase (e.g., `eventService`, `dataSource`)

### Zod Schemas

* **Create** : `create{Entity}Schema` (e.g., `createEventSchema`)
* **Update** : `update{Entity}Schema` (e.g., `updateEventSchema`)
* **Params** : `{entity}IdSchema` (e.g., `eventIdSchema`)
* **Types** : `Create{Entity}Dto`, `Update{Entity}Dto` (e.g., `CreateEventDto`)

---

## Response Format

### Success Response

```typescript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": { // Optional, for list endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```typescript
{
  "success": false,
  "message": "Error message",
  "errors": [ // Optional, for validation errors
    {
      "path": "fieldName",
      "message": "Error description"
    }
  ]
}
```

---

## HTTP Status Codes

* **200** : OK (successful GET, PUT, DELETE)
* **201** : Created (successful POST)
* **400** : Bad Request (validation errors)
* **401** : Unauthorized (authentication required)
* **403** : Forbidden (insufficient permissions)
* **404** : Not Found (resource doesn't exist)
* **409** : Conflict (duplicate resource)
* **500** : Internal Server Error (unexpected errors)

---

## Best Practices

### 1. Dependency Injection

Always inject dependencies through constructors:

```typescript
export class EntityService {
  constructor(private readonly entityRepository: IEntityRepository) {}
}
```

### 2. Error Handling

Use custom AppError for expected errors:

```typescript
if (!entity) {
  throw new AppError('Entity not found', 404);
}
```

### 3. Validation

Validate at controller level using Zod:

```typescript
const validatedData = createEntitySchema.parse(req.body);
```

### 4. Async/Await

Always use async/await for asynchronous operations:

```typescript
async findById(id: string): Promise<Entity> {
  return await this.repository.findById(id);
}
```

### 5. Type Safety

Leverage TypeScript and Zod for type safety:

```typescript
export type CreateEntityDto = z.infer<typeof createEntitySchema>;
```

### 6. Single Responsibility

Each layer should have one clear responsibility:

* **Repository** : Database operations
* **Service** : Business logic
* **Controller** : Request/response handling
* **Validator** : Input validation

### 7. DRY (Don't Repeat Yourself)

Extract common logic into shared utilities:

```typescript
// src/shared/utils/pagination.util.ts
export const calculatePagination = (page: number, limit: number) => {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};
```

### 8. Consistent Naming

Follow naming conventions throughout the codebase for better readability and maintainability.

### 9. Comments and Documentation

Add JSDoc comments for complex functions:

```typescript
/**
 * Creates a new event with validation
 * @param data - Event creation data
 * @returns Created event entity
 * @throws AppError if validation fails
 */
async create(data: CreateEventDto): Promise<Event> {
  // Implementation
}
```

### 10. Environment Variables

Use environment variables for configuration:

```typescript
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
```

---

## Folder Structure Per Module

```
src/modules/events/
├── controllers/
├── dto/
├── entities/
├── repositories/
├── routes/     
└── services/     
```

---

## Summary

This code pattern ensures:

* ✅ Clear separation of concerns
* ✅ Type safety with TypeScript and Zod
* ✅ Testability through dependency injection
* ✅ Maintainability with consistent structure
* ✅ Scalability with modular architecture
* ✅ Code reusability across modules

Follow these patterns consistently across all modules to maintain code quality and team productivity.
