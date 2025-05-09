# E-Commerce Uygulaması Başlatma Rehberi

## 1. Geliştirme Ortamının Hazırlanması

```bash
# Node.js ve npm'in yüklü olduğundan emin olun
node -v
npm -v

# Gerekli global paketlerin yüklenmesi
npm install -g @nestjs/cli
npm install -g typescript
```

## 2. Proje Bağımlılıklarının Yüklenmesi

```bash
# Proje bağımlılıklarını yükle
npm install

# Geliştirme bağımlılıklarını yükle
npm install --save-dev @types/node @types/express
```

## 3. Veritabanı Kurulumu

```bash
# PostgreSQL'in yüklü olduğundan emin olun
# Docker kullanarak veritabanını başlat
docker-compose up -d
```

## 4. Ortam Değişkenlerinin Ayarlanması

`.env` dosyasını oluşturun ve aşağıdaki içeriği ekleyin:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

## 5. Veritabanı Migrasyonlarının Çalıştırılması

```bash
# Veritabanı migrasyonlarını çalıştır
npm run migration:run
```

## 6. Uygulamayı Başlatma

```bash
# Geliştirme modunda başlat
npm run start:dev

# veya

# Production build
npm run build
npm run start:prod
```

## 7. Test Etme

```bash
# Unit testleri çalıştır
npm run test

# E2E testleri çalıştır
npm run test:e2e
```

## 8. API Dokümantasyonu

```bash
# Swagger dokümantasyonuna erişim
# Tarayıcınızda http://localhost:3000/api adresini açın
```

## Önemli Komutlar ve Scriptler

`package.json` dosyanızda bulunan önemli scriptler:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

## Hata Ayıklama İpuçları

1. **Veritabanı Bağlantı Sorunları:**
   ```bash
   # PostgreSQL servisinin durumunu kontrol et
   docker ps
   
   # Veritabanı loglarını kontrol et
   docker logs <container_id>
   ```

2. **Port Çakışmaları:**
   ```bash
   # Kullanılan portları kontrol et
   lsof -i :3000
   ```

3. **Bağımlılık Sorunları:**
   ```bash
   # node_modules'u temizle ve yeniden yükle
   rm -rf node_modules
   npm install
   ```

## Güvenlik Kontrol Listesi

1. `.env` dosyasının `.gitignore'da olduğundan emin olun
2. JWT secret'ını güçlü bir değerle değiştirin
3. Veritabanı şifrelerini güçlü değerlerle değiştirin
4. CORS ayarlarını production'da sıkılaştırın

## Monitoring ve Logging

```bash
# Uygulama loglarını izle
npm run start:dev | tee app.log

# Docker container loglarını izle
docker-compose logs -f
```

## Ek Bilgiler

- Uygulama başlatıldığında varsayılan olarak `http://localhost:3000` adresinde çalışacaktır
- API endpoint'leri `http://localhost:3000/api` altında bulunmaktadır
- Swagger dokümantasyonu `http://localhost:3000/api` adresinde erişilebilir
- Geliştirme modunda hot-reload aktif olacaktır
- Production build için `npm run build` komutunu kullanın

## Sorun Giderme

Eğer herhangi bir sorunla karşılaşırsanız:

1. Tüm servislerin çalıştığından emin olun
2. Port çakışmalarını kontrol edin
3. Veritabanı bağlantısını kontrol edin
4. Log dosyalarını inceleyin
5. Gerekirse node_modules'u temizleyip yeniden yükleyin

## İletişim

Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, lütfen proje yöneticisi ile iletişime geçin.
