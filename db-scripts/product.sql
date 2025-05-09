-- Product tablosunu oluşturma
CREATE TABLE "products" (
  -- BaseEntity'den gelen alanlar
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  
  -- Product Entity'sine özel alanlar
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(1000),
  "price" DECIMAL(10, 2) NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "store_id" INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  "rating" FLOAT NOT NULL DEFAULT 0,
  "sell_count" INTEGER NOT NULL DEFAULT 0,
  "imageUrl" VARCHAR(255),
  "images" JSON
);

-- Gerekli indeksleri oluşturma
CREATE INDEX "IDX_PRODUCTS_NAME" ON "products" ("name");
CREATE INDEX "IDX_PRODUCTS_PRICE" ON "products" ("price");
CREATE INDEX "IDX_PRODUCTS_STORE_ID" ON "products" ("store_id");
CREATE INDEX "IDX_PRODUCTS_CATEGORY_ID" ON "products" ("category_id");
CREATE INDEX "IDX_PRODUCTS_RATING" ON "products" ("rating");
CREATE INDEX "IDX_PRODUCTS_SELL_COUNT" ON "products" ("sell_count");

-- Örnek ürün verileri ekleme
INSERT INTO "products" (
  "name", 
  "description", 
  "price", 
  "stock", 
  "store_id", 
  "category_id", 
  "rating", 
  "sell_count", 
  "imageUrl", 
  "images"
) 
VALUES 
  (
    'iPhone 14 Pro', 
    'Apple iPhone 14 Pro 256GB Derin Mor', 
    44999.99, 
    50, 
    1, 
    2, 
    4.8, 
    1250, 
    'https://example.com/iphone14.jpg',
    '[{"url": "https://example.com/iphone14_1.jpg", "index": 1}, {"url": "https://example.com/iphone14_2.jpg", "index": 2}]'
  ),
  (
    'Samsung Galaxy S23', 
    'Samsung Galaxy S23 Ultra 512GB Siyah', 
    39999.99, 
    35, 
    1, 
    2, 
    4.7, 
    980, 
    'https://example.com/s23.jpg',
    '[{"url": "https://example.com/s23_1.jpg", "index": 1}, {"url": "https://example.com/s23_2.jpg", "index": 2}]'
  ),
  (
    'Asus ROG Strix G16', 
    'ASUS ROG Strix G16 Intel Core i9 13980HX 32GB 1TB SSD RTX 4090 16" Oyun Bilgisayarı', 
    92999.99, 
    15, 
    2, 
    1, 
    4.9, 
    120, 
    'https://example.com/rog.jpg',
    '[{"url": "https://example.com/rog_1.jpg", "index": 1}, {"url": "https://example.com/rog_2.jpg", "index": 2}, {"url": "https://example.com/rog_3.jpg", "index": 3}]'
  );

-- İlişkiler için foreign key eklemesi (store ve category tabloları varsa)
-- ALTER TABLE "products" ADD CONSTRAINT "FK_PRODUCTS_STORE" FOREIGN KEY ("store_id") REFERENCES "stores" ("id");
-- ALTER TABLE "products" ADD CONSTRAINT "FK_PRODUCTS_CATEGORY" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

-- Tablo ve sütunlar için açıklamalar ekleme
COMMENT ON TABLE "products" IS 'Ürün bilgilerini saklayan tablo';
COMMENT ON COLUMN "products"."name" IS 'Ürün adı';
COMMENT ON COLUMN "products"."description" IS 'Ürün açıklaması';
COMMENT ON COLUMN "products"."price" IS 'Ürün fiyatı';
COMMENT ON COLUMN "products"."stock" IS 'Ürün stok miktarı';
COMMENT ON COLUMN "products"."store_id" IS 'Ürünün ait olduğu mağaza ID';
COMMENT ON COLUMN "products"."category_id" IS 'Ürünün ait olduğu kategori ID';
COMMENT ON COLUMN "products"."rating" IS 'Ürün değerlendirme puanı';
COMMENT ON COLUMN "products"."sell_count" IS 'Ürün satış sayısı';
COMMENT ON COLUMN "products"."imageUrl" IS 'Ürünün ana görseli';
COMMENT ON COLUMN "products"."images" IS 'Ürüne ait görseller dizisi (JSON formatında)';