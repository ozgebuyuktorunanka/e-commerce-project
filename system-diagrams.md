# 🏗️ E-Commerce System Architecture Diagrams

This document provides visual representations of the e-commerce system architecture, module structure, data flow, and more. These diagrams serve as a guide to understanding the overall system design and functionalities.

## 📊 System Architecture Overview

<img src="systemArchitecture.png" alt="System Architecture Diagram" width="400"/>

----

```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
    end
    subgraph Backend [NestJS Backend]
        Auth[Authentication Module]
        Users[Users Module]
        Products[Products Module]
        Cart[Cart Module]
        Orders[Orders Module]
        Payments[Payments Module]
        Health[Health Check Module]
    end
    subgraph Database
        DB[(Database)]
    end
    subgraph External Services
        PaymentGateway[Payment Gateway]
    end
    %% Frontend to Backend connections
    UI --> Auth
    UI --> Products
    UI --> Cart
    UI --> Orders
    UI --> Payments
    %% Backend internal connections
    Auth --> Users
    Cart --> Products
    Orders --> Products
    Orders --> Users
    Payments --> Orders
    Payments --> PaymentGateway
    %% Database connections
    Users --> DB
    Products --> DB
    Cart --> DB
    Orders --> DB
    Payments --> DB
    %% Health check
    Health --> DB
```

### Description:
This diagram illustrates the high-level architecture of the e-commerce system. The frontend interacts with various backend modules, which communicate with a central database and external services like payment gateways.

---

## 📁 Module Structure

```mermaid
graph TB
    subgraph NestJS Application
        AppModule[App Module]
        subgraph Feature Modules
            AuthModule[Auth Module]
            UsersModule[Users Module]
            ProductsModule[Products Module]
            CartModule[Cart Module]
            OrdersModule[Orders Module]
            PaymentsModule[Payments Module]
            HealthModule[Health Module]
        end
        subgraph Common Module
            Guards[Guards]
            Pipes[Pipes]
            Interceptors[Interceptors]
            Filters[Exception Filters]
            DTOs[DTOs]
        end
    end
    AppModule --> AuthModule
    AppModule --> UsersModule
    AppModule --> ProductsModule
    AppModule --> CartModule
    AppModule --> OrdersModule
    AppModule --> PaymentsModule
    AppModule --> HealthModule
    AuthModule --> Guards
    AuthModule --> DTOs
    UsersModule --> Guards
    UsersModule --> Pipes
    UsersModule --> DTOs
    ProductsModule --> Guards
    ProductsModule --> Pipes
    ProductsModule --> DTOs
    CartModule --> Guards
    CartModule --> DTOs
    OrdersModule --> Guards
    OrdersModule --> DTOs
    PaymentsModule --> Guards
    PaymentsModule --> DTOs
    HealthModule --> DTOs
```

### Description:
This diagram outlines the internal structure of the NestJS application, showcasing how feature modules and common components are organized. Each module encapsulates related functionalities, while the common module provides shared components.

---

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant Auth
    participant API
    participant DB
    participant Payment
    Client->>Auth: Login Request
    Auth->>Client: JWT Token
    Client->>API: API Request with JWT
    API->>Auth: Validate Token
    Auth->>API: Token Valid
    API->>DB: Database Operation
    DB->>API: Operation Result
    alt Payment Required
        API->>Payment: Process Payment
        Payment->>API: Payment Result
    end
    API->>Client: Response
```

### Description:
This sequence diagram illustrates the flow of data during a typical user authentication and API request process. It highlights how the client interacts with the authentication module and API, including token validation and database operations.

---

## 🛒 Shopping Cart Flow

```mermaid
sequenceDiagram
    participant User
    participant Cart
    participant Products
    participant Orders
    participant Payment
    User->>Products: Browse Products
    Products->>User: Product List
    User->>Cart: Add to Cart
    Cart->>Products: Check Stock
    Products->>Cart: Stock Available
    Cart->>User: Item Added
    User->>Cart: View Cart
    Cart->>User: Cart Contents
    User->>Orders: Checkout
    Orders->>Cart: Get Cart Items
    Cart->>Orders: Cart Data
    Orders->>Payment: Process Payment
    Payment->>Orders: Payment Confirmed
    Orders->>User: Order Confirmation
```

### Description:
This diagram outlines the process of adding items to the shopping cart and proceeding to checkout. It shows the interaction between the user, products, cart, orders, and payment processes.

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Auth
    participant DB
    participant API
    User->>Auth: Login Request
    Auth->>DB: Validate Credentials
    DB->>Auth: User Data
    Auth->>Auth: Generate JWT
    Auth->>User: JWT Token
    User->>API: Request with JWT
    API->>Auth: Validate Token
    Auth->>API: Token Valid
    API->>User: Protected Resource
```

### Description:
This diagram represents the user authentication process, detailing how the user logs in, how credentials are validated, and how JWT tokens are used for accessing protected resources.

---

## 📦 Order Processing Flow

```mermaid
graph TB
    subgraph Order Processing
        Start[Order Initiated]
        StockCheck[Stock Check]
        PaymentProcess[Payment Processing]
        OrderConfirm[Order Confirmation]
        Shipment[Shipment Processing]
        Delivery[Delivery]
    end
    Start --> StockCheck
    StockCheck --> PaymentProcess
    PaymentProcess --> OrderConfirm
    OrderConfirm --> Shipment
    Shipment --> Delivery
    subgraph Error Handling
        StockError[Stock Error]
        PaymentError[Payment Error]
        ShipmentError[Shipment Error]
    end
    StockCheck --> StockError
    PaymentProcess --> PaymentError
    Shipment --> ShipmentError
```

### Description:
This diagram illustrates the steps involved in processing an order, from initiation through to delivery, including error handling for potential issues at each stage.

---

## 🔍 API Endpoints Structure

```mermaid
graph TB
    subgraph API Endpoints
        Auth[Auth Endpoints]
        Users[User Endpoints]
        Products[Product Endpoints]
        Cart[Cart Endpoints]
        Orders[Order Endpoints]
        Payments[Payment Endpoints]
    end
    subgraph Auth Endpoints
        Login[POST /auth/login]
        Register[POST /auth/register]
        Refresh[POST /auth/refresh]
    end
    subgraph User Endpoints
        GetUser[GET /users/:id]
        UpdateUser[PUT /users/:id]
        DeleteUser[DELETE /users/:id]
    end
    subgraph Product Endpoints
        ListProducts[GET /products]
        GetProduct[GET /products/:id]
        CreateProduct[POST /products]
        UpdateProduct[PUT /products/:id]
        DeleteProduct[DELETE /products/:id]
    end
    Auth --> Login
    Auth --> Register
    Auth --> Refresh
    Users --> GetUser
    Users --> UpdateUser
    Users --> DeleteUser
    Products --> ListProducts
    Products --> GetProduct
    Products --> CreateProduct
    Products --> UpdateProduct
    Products --> DeleteProduct
```

### Description:
This diagram provides an overview of the API endpoints available in the application, categorized by functionality. Each endpoint is clearly defined, indicating the HTTP methods and paths.

---

### Final Notes
- Ensure that the diagrams are updated to reflect any changes in your system architecture or workflows.
- Consider adding additional sections for future enhancements, deployment strategies, or specific technologies used in your stack.
