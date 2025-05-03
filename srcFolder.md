#### 📂 Example Module Structure
📌

    ├── auth/
    │   ├── dto/
    │   ├── entities/
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts
    │   │   └── jwt.strategy.ts
    │   ├── auth.module.ts
    │   ├── auth.service.spec.ts
    │   └── auth.service.ts
    ├── common/
    │   ├── dto/
    │   │   └── pagination-query.dto.ts
    │   ├── entities/
    │   │   ├── baseEntity.ts
    │   │   └── BaseEntityWithName.ts
    │   ├── filters/
    │   │   └── http-exception.filter.ts
    │   ├── guards/
    │   │   ├── admin.guard.ts
    │   │   └── super-admin.guard.ts
    │   ├── interceptors/
    │   │   └── transform-response.interceptor.ts
    │   └── pipes/
    │       ├── capitalize-name.pipe.ts
    │       └── parse-int.pipe.ts
    ├── data/
    │   ├── dummy-product.ts
    │   └── dummy-users.ts
    ├── orders/
    │   ├── dto/
    │   │   ├── create-order.dto.ts
    │   │   └── update-order.dto.ts
    │   ├── entities/
    │   │   └── order.entity.ts
    │   ├── orders.controller.spec.ts
    │   ├── orders.controller.ts
    │   ├── orders.module.ts
    │   ├── orders.service.spec.ts
    │   └── orders.service.ts
    ├── payments/
    │   ├── dto/
    │   │   ├── create-payment.dto.ts
    │   │   └── update-payment.dto.ts
    │   ├── entities/
    │   │   └── payments.entity.ts
    │   ├── types/
    │   │   └── payments.methods.ts
    │   ├── payments.controller.spec.ts
    │   ├── payments.controller.ts
    │   ├── payments.module.ts
    │   ├── payments.service.spec.ts
    │   └── payments.service.ts
    ├── products/
    │   ├── dto/
    │   │   ├── create-product.dto.ts
    │   │   └── update-product.dto.ts
    │   ├── entities/
    │   │   └── product.entity.ts
    │   ├── products.controller.spec.ts
    │   ├── products.controller.ts
    │   ├── products.module.ts
    │   ├── products.service.spec.ts
    │   └── products.service.ts
    ├── users/
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   ├── entities/
    │   │   ├── user.entity.ts
    │   │   └── user.enum.ts
    │   ├── users.controller.spec.ts
    │   ├── users.controller.ts
    │   ├── users.module.ts
    │   ├── users.service.spec.ts
    │   └── users.service.ts
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    └── main.ts

    📌