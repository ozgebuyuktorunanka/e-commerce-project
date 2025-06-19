    libs/src
    ├── auth
    │  └── auth-pattern.ts
    ├── authService
    │  ├── decorator
    │  │  └── roles.decorator.ts
    │  ├── dto
    │  │  ├── login.dto.ts
    │  │  └── register.dto.ts
    │  ├── entities
    │  │  └── auth.entity.ts
    │  ├── guards
    │  │  ├── jwt-auth.guard.ts
    │  │  ├── roles.guard.ts
    │  │  └── super-admin.guard.ts
    │  ├── jwt
    │  │  └── jwt-auth.guard.ts
    │  └── utils
    │     └── types.ts
    ├── carts
    │  ├── dto
    │  │  └── cart.dto.ts
    │  ├── interface
    │  │  └── requestUser.ts
    │  ├── schema
    │  │  └── cart.schema.ts
    │  └── cartController.md
    ├── constants
    │  └── services.ts
    ├── db-scripts
    │  ├── payment.sql
    │  ├── product.sql
    │  ├── product_image.sql
    │  └── user.sql
    ├── decoraters
    │  └── is-strong-password.decorater.ts
    ├── dto
    │  └── pagination-query.dto.ts
    ├── entities
    │  ├── BaseEntityWithName.ts
    │  └── baseEntity.ts
    ├── filters
    │  ├── http-exception.filter.ts
    │  └── rpc-exception.filter.ts
    ├── guards
    │  ├── admin.guard.ts
    │  ├── jwt-auth.guard.ts
    │  ├── owner.guard.ts
    │  ├── roles.guard.ts
    │  └── super-admin.guard.ts
    ├── health
    │  ├── health.controller.ts
    │  ├── health.module.ts
    │  └── mongo-health.indicator.ts
    ├── interceptors
    │  ├── logging.interceptor.ts
    │  ├── response.interceptor.ts
    │  └── transform-response.interceptor.ts
    ├── interfaces
    │  └── requestWithUser.ts
    ├── logger
    │  └── winston-logger.ts
    ├── orders
    │  ├── dto
    │  │  ├── create-order-item.dto.ts
    │  │  ├── create-order.dto.ts
    │  │  └── update-order.dto.ts
    │  └── entities
    │     ├── order-item.entity.ts
    │     └── order.entity.ts
    ├── pipes
    │  ├── capitalize-name.pipe.ts
    │  ├── parse-int.pipe.ts
    │  └── validation.pipe.ts
    ├── productsService
    │  ├── dto
    │  │  ├── create-product.dto.ts
    │  │  ├── product-comment.dto.ts
    │  │  └── update-product.dto.ts
    │  └── entities
    │     ├── product-comment.entity.ts
    │     └── product.entity.ts
    ├── usersService
    │  ├── dto
    │  │  ├── create-user.dto.ts
    │  │  ├── update-user.dto.ts
    │  │  ├── user-visit-history.dto.ts
    │  │  └── userResponse.dto.ts
    │  ├── entities
    │  │  ├── user.entity.ts
    │  │  └── user.enum.ts
    │  ├── pattern
    │  │  └── user-pattern.ts
    │  ├── schemas
    │  │  ├── user-schema.ts
    │  │  └── user-visit-history.schema.ts
    │  └── services
    │     └── user-visit-history.service.ts
    ├── index.ts
    ├── package.json
    └── tsconfig.json
