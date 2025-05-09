-- User table creating
CREATE TABLE "user" (
  -- BaseEntityWithName'den gelen alanlar (varsayılan olarak)
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  
  -- User Entity'sine özel alanlar
  "email" VARCHAR(150) NOT NULL,
  "password" VARCHAR(100) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "role" VARCHAR(50) NOT NULL DEFAULT 'USER', -- enum değeri
  "birthday" TIMESTAMP
);

-- Creat index.
CREATE INDEX "IDX_USER_EMAIL" ON "user" ("email");
CREATE INDEX "IDX_USER_ROLE" ON "user" ("role");

-- Example Adding.
INSERT INTO "user" ("name", "email", "password", "is_active", "role", "birthday") 
VALUES 
  ('Admin User', 'admin@example.com', '$2a$10$HfzIhGCCaxqyaIdGgjWONuXiHt6xWjgdK6pYuWa.9GBH4KO9SGnNy', true, 'ADMIN', '1990-01-01'),
  ('Test User', 'user@example.com', '$2a$10$HfzIhGCCaxqyaIdGgjWONuXiHt6xWjgdK6pYuWa.9GBH4KO9SGnNy', true, 'USER', '1995-05-15'),
  ('Deaktif User', 'inactive@example.com', '$2a$10$HfzIhGCCaxqyaIdGgjWONuXiHt6xWjgdK6pYuWa.9GBH4KO9SGnNy', false, 'USER', '1988-10-22');

-- Add comment in User Table
COMMENT ON TABLE "user" IS 'Kullanıcı bilgilerini saklayan tablo';
COMMENT ON COLUMN "user"."email" IS 'Kullanıcının benzersiz email adresi';
COMMENT ON COLUMN "user"."password" IS 'Kullanıcının şifrelenmiş parolası';
COMMENT ON COLUMN "user"."is_active" IS 'Kullanıcı hesabının aktif olup olmadığı';
COMMENT ON COLUMN "user"."role" IS 'Kullanıcının rolü (ADMIN, USER vb.)';
COMMENT ON COLUMN "user"."birthday" IS 'Kullanıcının doğum tarihi';

