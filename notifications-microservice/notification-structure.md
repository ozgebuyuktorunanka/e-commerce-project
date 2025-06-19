    notifications-microservice/
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts (NotificationsAppModule)
    │   ├── kafka/
    │   │   ├── kafka.module.ts
    │   │   ├── kafka.service.ts
    │   │   └── consumers/
    │   │       ├── order-events.consumer.ts
    │   │       ├── user-events.consumer.ts
    │   │       └── payment-events.consumer.ts
    │   ├── notifications/
    │   │   ├── notifications.module.ts
    │   │   ├── notifications.controller.ts
    │   │   ├── notifications.service.ts
    │   │   └── dto/
    │   │       ├── create-notification.dto.ts
    │   │       └── send-notification.dto.ts
    │   ├── email/
    │   │   ├── email.module.ts
    │   │   ├── email.service.ts
    │   │   └── templates/
    │   │       ├── order-confirmation.hbs
    │   │       ├── password-reset.hbs
    │   │       └── welcome.hbs
    │   └── sms/ (opsiyonel)
    │       ├── sms.module.ts
    │       └── sms.service.ts

## 🔗 Module Dependencies:
        NotificationsAppModule
    ├── ConfigModule (Global)
    ├── KafkaModule
    │   └── KafkaService (Kafka consumer/producer)
    ├── NotificationsModule
    │   ├── NotificationsController (REST endpoints)
    │   ├── NotificationsService (Business logic)
    │   └── EmailModule (Dependency)
    └── EmailModule
        └── EmailService (Email sending)
