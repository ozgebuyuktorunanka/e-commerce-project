### Step1: Create a new NestJs project
```typescript
nest new ecommerce-app
```
# Step 2: Generate modules
```
    npm install -g @nestjs/cli
    nest g module users
    nest g module products
    nest g module orders
    nest g module payments
    nest g module auth
    mkdir src/common
```

### Step 3: Generate controllers and services for each module
```
 nest g controller users --flat
 nest g service users --flat
 nest g controller products --flat
 nest g service products --flat
 nest g controller orders --flat
 nest g service orders --flat
 nest g controller payments --flat
 nest g service payments --flat
 nest g service auth --flat
```

### Step 3: Dependecies download
```npm install class-validator class-transformer```

### Step 4: Common Folder Creation
```mkdir -p src/common/{pipes,interceptors,filters,guards,dto}```

### Module Creation
````
# Users modülü
nest g controller users
nest g service users
mkdir -p src/users/{dto,entities}

# Products modülü
nest g controller products
nest g service products
mkdir -p src/products/{dto,entities}

# Orders modülü
nest g controller orders
nest g service orders
mkdir -p src/orders/{dto,entities}

# Payments modülü
nest g controller payments
nest g service payments
mkdir -p src/payments/{dto,entities}

# Auth modülü
nest g service auth
mkdir -p src/auth/{dto,guards}
````
📝 Not: Her modül için ilgili klasör yapısını oluşturuyoruz. DTO'lar (Data Transfer Objects) client ve server arasında veri transferini tanımlar, entities ise veritabanı modellerini temsil eder.
