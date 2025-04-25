# NodeJS Bootcamp Weekly Project #3: E-Commerce CRUD API with NestJS

Bu hafta hedefiniz: **Profesyonel bir e-ticaret backend modül yapısını kurmak** ve temel `Users` ve `Products` modülleri için **CRUD API** oluşturmak. NestJS içinde `best practice` mimarilerle çalışmayı öğreneceksiniz.

---

## 🚀 1. Proje Kurulumu

```bash
nest new ecommerce-app
cd ecommerce-app
```

## 🧱 2. Modül Yapısı

Aşağıdaki modül yapısını kurun. Her modül kendi controller, service, dto ve entity klasörlerine sahip olmalıdır.

### Modüller

- UsersModule (Feature): Service & Controller
- ProductsModule (Feature): Service & Controller
- OrderModule (Feature): Service & Controller
- PaymentModule (Feature): Service & Controller
- Auth Module (Global): Service
- Common folder

## 3. Dummy Data ile CRUD Geliştirme

Aşağıdaki dummy JSON verileri üzerinden çalışın:

- dummyUsers.json: 20 farklı kullanıcı bilgisi
- dummyProducts.json: 100 farklı ürün bilgisi

### Görevler:

- User ve Product için GET, POST, PUT, DELETE endpointlerini yazın
- Get list requestleri `URL Query` ile paginated olmalı: `{page, limit, sort, order}`
- Delete requestleri `URL Parameter` ile `id` bilgisini almalı tanımlanmalı
- `id` url parametresi pipe ile `number` tipine çevirilmeli
- Genel type tanımlarını yapılmalı
- Create requestleri için DTO tanımları yapılmalı
- class-validator ve class-transformer ile validasyon yapılmalı

## 4. Pipe Kullanımı

### CapitalizeNamePipe:

Kullanıcı ismini alır, ilk harfi büyük geri kalanı küçük hale getirir:

```bash
AhmEt Tek -> Ahmet Tek
ali DOĞRU   -> Ali Doğru
```

Bu pipe hem UsersModule hem ProductsModule içinde kullanılacak.
`common/pipes/` klasöründe tanımlanmalı.

## 5. Response Interceptor

Tüm başarılı response’lar şu formatta dönmelidir:

```ts
{
  "success": boolean true,
  "timestamp": ISO Date string,
  "data": T
}
```

Interceptor adı: `TransformResponseInterceptor` <br />
Tanımı: `common/interceptors/transform-response.interceptor.ts`

## 6. Exception Filter

Tüm hata durumlarında cevap şu formatta olmalıdır:

```ts
{
  "success": boolean false,
  "timestamp": ISO Date string,
  "message": string
}
```

## 7. Guards

Auth modülü içinde `SuperAdminGuard` ve `AdminGuard` adında iki tane Guard oluştur.
<br />

### Super Admin Guard

- Kullanıcı silme
- Kullanıcı rol değiştirme

### Admin Guard

- Ürün silme
- Ürün ekleme
- Ürün güncelleme

**Not:** Super Admin, Admin in tüm haklarına sahiptir.
