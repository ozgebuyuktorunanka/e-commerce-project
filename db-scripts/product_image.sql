-- ProductImageUrl tablosunu oluşturma
CREATE TABLE "product_imageurl" (
  -- BaseEntity'den gelen alanlar
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  
  -- Product ilişkisi için foreign key
  "product_id" UUID NOT NULL,
  
  -- Görsel URL'si
  "url" VARCHAR(255) NOT NULL,
  
  -- Görselin sırası/indeksi
  "index" INTEGER NOT NULL DEFAULT 0,
  
  -- Görsel açıklaması (opsiyonel)
  "alt_text" VARCHAR(255),
  
  -- Ana görsel mi? (ürünün vitrin görseli)
  "is_primary" BOOLEAN NOT NULL DEFAULT false
);

-- Foreign key oluşturma
ALTER TABLE "product_imageurl" ADD CONSTRAINT "FK_PRODUCT_IMAGEURL_PRODUCT" 
  FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;

-- İndeksler oluşturma
CREATE INDEX "IDX_PRODUCT_IMAGEURL_PRODUCT_ID" ON "product_imageurl" ("product_id");
CREATE INDEX "IDX_PRODUCT_IMAGEURL_IS_PRIMARY" ON "product_imageurl" ("is_primary");

-- Örnek görsel verileri ekleme
INSERT INTO "product_imageurl" (
  "product_id", 
  "url", 
  "index", 
  "alt_text", 
  "is_primary"
) 
VALUES 
  -- iPhone 14 Pro için görseller
  (
    '123e4567-e89b-12d3-a456-426614174000', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/iphone14pro_1.jpg', 
    1, 
    'iPhone 14 Pro Derin Mor - Ön Görünüm', 
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/iphone14pro_2.jpg', 
    2, 
    'iPhone 14 Pro Derin Mor - Arka Görünüm', 
    false
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/iphone14pro_3.jpg', 
    3, 
    'iPhone 14 Pro Derin Mor - Kamera Detayı', 
    false
  ),
  
  -- Samsung Galaxy S23 için görseller
  (
    '123e4567-e89b-12d3-a456-426614174001', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/samsungs23_1.jpg', 
    1, 
    'Samsung Galaxy S23 Ultra Siyah - Ön Görünüm', 
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174001', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/samsungs23_2.jpg', 
    2, 
    'Samsung Galaxy S23 Ultra Siyah - Arka Görünüm', 
    false
  ),
  (
    '123e4567-e89b-12d3-a456-426614174001', -- Bu örnek bir product ID'dir, gerçek bir product ID ile değiştirilmelidir
    'https://example.com/images/samsungs23_3.jpg', 
    3, 
    'Samsung Galaxy S23 Ultra Siyah - Kalem Detayı', 
    false
  );

-- Tablo ve sütunlar için açıklamalar
COMMENT ON TABLE "product_imageurl" IS 'Ürün görsellerini saklayan tablo';
COMMENT ON COLUMN "product_imageurl"."product_id" IS 'Görselin ait olduğu ürün ID';
COMMENT ON COLUMN "product_imageurl"."url" IS 'Görsel URL adresi';
COMMENT ON COLUMN "product_imageurl"."index" IS 'Görselin sıra numarası';
COMMENT ON COLUMN "product_imageurl"."alt_text" IS 'Görsel alternatif metni (SEO ve erişilebilirlik için)';
COMMENT ON COLUMN "product_imageurl"."is_primary" IS 'Ana görsel olup olmadığı';

-- Not: Örnek verilerde kullanılan product ID'leri gerçek verilerinize göre güncellenmelidir