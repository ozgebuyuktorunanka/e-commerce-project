-- PaymentStatus ve PaymentMethod enum tipleri oluşturma
-- Not: Bu enum değerleri kodunuzda tanımlandığı gibi olmalıdır
CREATE TYPE "payment_status_enum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
CREATE TYPE "payment_method_enum" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH', 'CRYPTO');

-- Payment tablosunu oluşturma
CREATE TABLE "payment" (
  -- BaseEntity'den gelen alanlar
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  
  -- Payment Entity'sine özel alanlar
  "orderId" UUID,
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" payment_status_enum NOT NULL DEFAULT 'PENDING',
  "paymentMethod" payment_method_enum NOT NULL,
  "transactionId" VARCHAR(255)
);

-- Foreign key oluşturma
ALTER TABLE "payment" ADD CONSTRAINT "FK_PAYMENT_ORDER" 
  FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE;

-- İndeksler oluşturma
CREATE INDEX "IDX_PAYMENT_ORDER_ID" ON "payment" ("orderId");
CREATE INDEX "IDX_PAYMENT_STATUS" ON "payment" ("status");
CREATE INDEX "IDX_PAYMENT_METHOD" ON "payment" ("paymentMethod");
CREATE INDEX "IDX_PAYMENT_TRANSACTION_ID" ON "payment" ("transactionId");

-- Örnek ödeme verileri ekleme
INSERT INTO "payment" (
  "orderId", 
  "amount", 
  "status", 
  "paymentMethod", 
  "transactionId"
) 
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174000', -- Bu örnek bir order ID'dir, gerçek bir order ID ile değiştirilmelidir
    1250.99, 
    'COMPLETED', 
    'CREDIT_CARD', 
    'TRX123456789'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174001', -- Bu örnek bir order ID'dir, gerçek bir order ID ile değiştirilmelidir
    750.50, 
    'PENDING', 
    'BANK_TRANSFER', 
    'BNK987654321'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174002', -- Bu örnek bir order ID'dir, gerçek bir order ID ile değiştirilmelidir
    350.25, 
    'FAILED', 
    'PAYPAL', 
    'PP123456XYZ'
  );

-- Tablo ve sütunlar için açıklamalar
COMMENT ON TABLE "payment" IS 'Ödeme bilgilerini saklayan tablo';
COMMENT ON COLUMN "payment"."orderId" IS 'Ödemenin ait olduğu sipariş ID';
COMMENT ON COLUMN "payment"."amount" IS 'Ödeme tutarı';
COMMENT ON COLUMN "payment"."status" IS 'Ödemenin durumu: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED';
COMMENT ON COLUMN "payment"."paymentMethod" IS 'Ödeme yöntemi: CREDIT_CARD, BANK_TRANSFER, PAYPAL, CASH, CRYPTO';
COMMENT ON COLUMN "payment"."transactionId" IS 'Ödeme işleminin benzersiz kimliği';

-- Not: Örnek verilerde kullanılan order ID'leri gerçek verilerinize göre güncellenmelidir
-- Ayrıca, PaymentStatus ve PaymentMethod enum değerleri kodunuzdaki gerçek değerlerle uyumlu olmalıdır