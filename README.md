# Kitap Sitesi

Kitap arama, listeleme ve yorum yapma özelliklerine sahip full-stack bir web uygulaması. Üniversite ödevi olarak geliştirilmiştir.

---

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python, Flask, Flask-JWT-Extended, Flask-SQLAlchemy |
| Frontend | React 18, Vite, React Router v6 |
| Veritabanı | MySQL 8 |
| CSS | Tailwind CSS |
| HTTP İstekleri | Axios |
| Şifreleme | bcrypt |
| Sunucu | Gunicorn |

---

## Kurulum

### Gereksinimler

- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### 1. Veritabanı Oluşturma

MySQL'e bağlan ve veritabanını oluştur:

```sql
CREATE DATABASE booksite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Kurulumu

```bash
cd backend

# Sanal ortam oluştur (isteğe bağlı ama önerilir)
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Bağımlılıkları kur
pip install -r requirements.txt

# .env dosyasını düzenle (kendi MySQL bilgilerini gir)
# Varsayılan: host=localhost, user=root, password=1234

# Uygulamayı başlat (tablolar otomatik oluşur)
python app.py
```

Backend `http://localhost:5000` adresinde çalışır.

#### Örnek Verileri Yükle (isteğe bağlı)

```bash
python seed.py
```

2 kullanıcı, 5 kategori, 8 kitap ve 10 yorum eklenir.

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

---

## .env Dosyası

`backend/.env` dosyası aşağıdaki değişkenleri içerir:

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `MYSQL_HOST` | MySQL sunucu adresi | `localhost` |
| `MYSQL_USER` | MySQL kullanıcı adı | `root` |
| `MYSQL_PASSWORD` | MySQL şifresi | `1234` |
| `MYSQL_DB` | Veritabanı adı | `booksite_db` |
| `JWT_SECRET_KEY` | JWT imzalama anahtarı | `gizli-anahtar-123` |

> **Not:** Production ortamında `JWT_SECRET_KEY` değerini uzun ve rastgele bir string ile değiştir.

---

## API Endpointleri

### Auth

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | Hayır |
| POST | `/api/auth/login` | Giriş, JWT token döner | Hayır |
| GET | `/api/auth/me` | Oturum açmış kullanıcı bilgisi | Evet |

### Kitaplar

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/books` | Kitap listesi (sayfalama: `?page=1&per_page=10`) | Hayır |
| GET | `/api/books?category=<id>` | Kategoriye göre filtrele | Hayır |
| GET | `/api/books/search?q=<kelime>` | Başlık veya yazarda ara | Hayır |
| GET | `/api/books/<id>` | Kitap detayı (yorumlarıyla) | Hayır |
| POST | `/api/books` | Yeni kitap ekle | Evet |
| PUT | `/api/books/<id>` | Kitap güncelle | Evet |
| DELETE | `/api/books/<id>` | Kitap sil | Evet |

### Yorumlar

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/books/<id>/reviews` | Kitabın yorumlarını getir | Hayır |
| POST | `/api/books/<id>/reviews` | Yorum ekle | Evet |

### Kategoriler

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/categories` | Tüm kategorileri listele | Hayır |

---

## Test Kullanıcıları (seed.py sonrası)

| Kullanıcı Adı | Email | Şifre |
|--------------|-------|-------|
| test1 | test1@example.com | test123 |
| test2 | test2@example.com | test123 |

---

## Ekran Görüntüleri

> *(Ekran görüntüleri buraya eklenecek)*

---

## AWS Deploy

AWS üzerinde yayına almak için [`aws-deploy.md`](aws-deploy.md) dosyasına bak.
