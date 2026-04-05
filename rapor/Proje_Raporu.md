# Kitap Sitesi Projesi - Proje Raporu

**Hazırlayan:** [Yusuf Tanrıverdi]  
**Öğrenci No:** [22290287]  
**Tarih:** Nisan 2026

---

## 1. Giriş

Bu proje, ders kapsamında verilen "Çift Katmanlı Web Uygulaması" ödevi için geliştirilmiştir. Proje bir kitap sitesi olarak tasarlanmıştır. Backend tarafında Python Flask ile REST API oluşturulmuş, frontend tarafında React ile kullanıcı arayüzü yapılmıştır. Veritabanı olarak MySQL kullanılmış ve tüm sistem AWS üzerinde yayına alınmıştır.

---

## 2. Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python Flask |
| Frontend | React (Vite) |
| Veritabanı | MySQL |
| CSS Framework | Tailwind CSS |
| Auth | JWT (JSON Web Token) |
| HTTP Client | Axios |
| Deploy - DB | AWS RDS |
| Deploy - Backend | AWS EC2 |
| Deploy - Frontend | AWS S3 |

---

## 3. Proje Yapısı

Proje iki ana klasörden oluşmaktadır: backend ve frontend. Bu iki katman birbirinden bağımsız çalışır. Frontend, backend API'ye HTTP istekleri atarak veri alışverişi yapar.

### 3.1 Backend Yapısı

- **app.py:** Ana Flask uygulaması. CORS, JWT ve blueprint kayıtları burada yapılır.
- **config.py:** Veritabanı ve JWT ayarları. Bilgiler .env dosyasından okunur.
- **models.py:** Veritabanı tabloları (User, Book, Category, Review).
- **routes/:** API endpointleri (auth.py, books.py, reviews.py).
- **seed.py:** Veritabanına örnek veri ekleyen script.

### 3.2 Frontend Yapısı

- **pages/:** Ana sayfa, kitap listesi, kitap detay, giriş, kayıt, kitap ekleme sayfaları.
- **components/:** Navbar, BookCard, ProtectedRoute gibi tekrar kullanılabilir bileşenler.
- **context/AuthContext.jsx:** JWT token yönetimi ve kullanıcı durumu.
- **api.js:** Axios instance ve backend bağlantı ayarları.

---

## 4. Veritabanı Tasarımı

MySQL veritabanında 5 tablo bulunmaktadır. SQLAlchemy ORM ile tanımlanmıştır.

| Tablo | Alanlar | Açıklama |
|-------|---------|----------|
| User | id, username, email, password_hash, created_at | Kullanıcı bilgileri |
| Book | id, title, author, description, isbn, cover_image_url, page_count, published_year | Kitap bilgileri |
| Category | id, name | Kategori bilgileri |
| book_category | book_id, category_id | Çoka çok ilişki ara tablosu |
| Review | id, user_id, book_id, rating, comment, created_at | Kullanıcı yorumları |

---

## 5. API Endpointleri

### 5.1 Auth Endpointleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Yeni kullanıcı kaydı |
| POST | /api/auth/login | Giriş yap, JWT token al |
| GET | /api/auth/me | Kullanıcı bilgisi getir |

### 5.2 Kitap Endpointleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/books | Kitapları listele |
| GET | /api/books/:id | Kitap detayı |
| POST | /api/books | Kitap ekle (JWT gerekli) |
| PUT | /api/books/:id | Kitap güncelle (JWT gerekli) |
| DELETE | /api/books/:id | Kitap sil (JWT gerekli) |
| GET | /api/books/search?q= | Kitap ara |

### 5.3 Yorum Endpointleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/books/:id/reviews | Yorumları getir |
| POST | /api/books/:id/reviews | Yorum ekle (JWT gerekli) |

---

## 6. Güvenlik Önlemleri

- **JWT Token:** Kullanıcı girişinde JWT token üretilir. Korumalı endpointlere erişim için token gereklidir.
- **Şifre Hashleme:** Kullanıcı şifreleri bcrypt ile hashlenip veritabanına kaydedilir.
- **CORS:** Backend'de CORS ayarları yapılarak cross-origin istekler kontrol edilir.
- **ProtectedRoute:** Frontend'de giriş yapılmadan erişilmemesi gereken sayfalar korunur.
- **.env Dosyası:** Hassas bilgiler (veritabanı şifresi, JWT secret) .env dosyasında tutulur.

---

## 7. AWS Deployment

Proje AWS bulut platformu üzerinde yayına alınmıştır.

| Servis | Kullanım | Detay |
|--------|----------|-------|
| AWS RDS | Veritabanı | MySQL 8.0, db.t3.micro (Free Tier) |
| AWS EC2 | Backend | Ubuntu 22.04, t2.micro, Gunicorn ile çalıştırılıyor |
| AWS S3 | Frontend | Static Website Hosting ile React uygulaması sunuluyor |

---

## 8. Ekran Görüntüleri

Projenin çalışır haldeki ekran görüntüleri sunum videosunda detaylı şekilde gösterilmiştir.

---

## 9. Sunum Videosu

**Video Linki:** [BURAYA VİDEO LİNKİNİ YAZIN]

---

## 10. Proje Linkleri

- **GitHub:** [https://github.com/ysftrv/kitap-sitesi-projesi]
- **Canlı Site:** http://kitap-sitesi-frontend.s3-website.eu-north-1.amazonaws.com
- **Youtube:** [https://youtu.be/-Oublp-GxBY]

---

## 11. Sonuç

Bu projede çift katmanlı bir web uygulaması geliştirilmiştir. Backend'de Flask ile RESTful API oluşturulmuş, frontend'de React ile kullanıcı arayüzü yapılmıştır. JWT ile kimlik doğrulama, MySQL ile veri yönetimi sağlanmıştır. Proje AWS üzerinde (RDS, EC2, S3) deploy edilerek bulut ortamında çalışır hale getirilmiştir. Kitap ekleme, listeleme, arama, filtreleme ve yorum yapma gibi temel CRUD işlemleri başarıyla gerçekleştirilmiştir.
