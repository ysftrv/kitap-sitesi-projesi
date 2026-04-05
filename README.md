# Kitap Sitesi Projesi

Bu proje üniversite dersi için yapılmış bir kitap sitesidir. Kullanıcılar kitapları görüntüleyebilir, arama yapabilir, yorum bırakabilir ve yeni kitap ekleyebilir.

## Kullanılan Teknolojiler

- **Backend:** Python Flask
- **Frontend:** React (Vite ile oluşturuldu)
- **Veritabanı:** MySQL
- **CSS:** Tailwind CSS
- **Auth:** JWT token
- **Deploy:** AWS (EC2, RDS, S3)

## Proje Yapısı

Proje iki katmanlı olarak tasarlandı:

- `backend/` → Flask ile yazılmış REST API
- `frontend/` → React ile yazılmış kullanıcı arayüzü

Backend ve frontend birbirinden bağımsız çalışıyor. Frontend, backend API'ye axios ile istek atıyor.

## Özellikler

- Kullanıcı kayıt ve giriş sistemi (JWT ile)
- Kitap listeleme, ekleme, güncelleme, silme
- Kitap arama (başlık ve yazara göre)
- Kategoriye göre filtreleme
- Kitaplara yorum ve puan verme
- Sayfalama (pagination)
- Responsive tasarım (mobil uyumlu)

## Kurulum

### Gereksinimler
- Python 3.10+
- Node.js 18+
- MySQL

### Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
```

`.env` dosyası oluşturun:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=sifreniz
MYSQL_DB=booksite_db
JWT_SECRET_KEY=gizli-anahtar-123
```

MySQL'de veritabanı oluşturun:

```sql
CREATE DATABASE booksite_db;
```

Uygulamayı başlatın:

```bash
python app.py
```

Örnek verileri yükleyin:

```bash
python seed.py
```

Backend http://localhost:5000 adresinde çalışır.

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:5173 adresinde çalışır.

## API Endpointleri

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| GET | /api/auth/me | Kullanıcı bilgisi |

### Kitaplar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/books | Kitapları listele |
| GET | /api/books/:id | Kitap detayı |
| POST | /api/books | Kitap ekle |
| PUT | /api/books/:id | Kitap güncelle |
| DELETE | /api/books/:id | Kitap sil |
| GET | /api/books/search?q= | Kitap ara |

### Yorumlar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/books/:id/reviews | Yorumları getir |
| POST | /api/books/:id/reviews | Yorum ekle |

### Kategoriler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/categories | Kategorileri listele |

## AWS Deploy

Proje AWS üzerinde yayınlandı:
- **Veritabanı:** AWS RDS (MySQL)
- **Backend:** AWS EC2 (Gunicorn ile çalışıyor)
- **Frontend:** AWS S3 (Static Website Hosting)

## Test Kullanıcıları

| Kullanıcı | Email | Şifre |
|-----------|-------|-------|
| test1 | test1@test.com | test123 |
| test2 | test2@test.com | test123 |

## Ekran Görüntüleri

(sunum videosunda gösterilmiştir)
