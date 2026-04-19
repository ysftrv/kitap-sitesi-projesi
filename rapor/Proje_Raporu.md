## ANKARA ÜNİVERSİTESİ

#### Mühendislik Fakültesi

#### Bilgisayar Mühendisliği Bölümü

## BULUT BİLİŞİM DERSİ

#### Proje-1 Raporu

## Çift Katmanlı Web Uygulaması:

# Kitap Sitesi Projesi

**Hazırlayan:** Yusuf Tanrıverdi

**Öğrenci No:** 22290287

**Tarih:**

**Github Linki :**

**Video Linki :**

```
Nisan 2026
```
```
https://github.com/ysftrv/kitap-sitesi-projesi
```
```
https://www.youtube.com/watch?v=u_wUXLl2V
```

## 1. Giriş

Bu proje, Bulut Bilişim dersi kapsamında verilen “Çift Katmanlı Web Uygulaması” ödevi için
geliştirilmiştir. Projenin temel amacı, bir web uygulamasının farklı katmanlarını (frontend,
backend, veritabanı) AWS bulut servisleri üzerinde bağımsız olarak deploy etmek ve bulut
ortamında çalışır hale getirmektir.

Uygulama bir kitap sitesi olarak tasarlanmıştır. Kullanıcılar kitapları listeleyebilir, arayabilir,
detaylarını inceleyebilir ve yorum yapabilir. Backend’de Python Flask ile RESTful API,
frontend’de React (Vite), veritabanı olarak MySQL kullanılmış ve tüm sistem AWS üzerinde
yayına alınmıştır.

## 2. Kullanılan Teknolojiler

```
Katman Teknoloji Bulut Servisi
Backend Python Flask AWS EC2 (Ubuntu 22.04, t2.micro)
```
```
Frontend React (Vite) AWS S3 (Static Website Hosting)
Veritabanı MySQL 8.0 AWS RDS (db.t3.micro, Free Tier)
```
```
Kimlik Doğrulama JWT —
```
```
CSS Tailwind CSS —
HTTP Client Axios —
```
## 3. Uygulama Özeti

Proje iki ana katmandan oluşmaktadır. Frontend ve backend birbirinden bağımsız çalışır;
aralarındaki iletişim HTTP üzerinden JSON formatında gerçekleşir.

### 3.1 Backend

Flask framework’ü ile RESTful API oluşturulmuştur. SQLAlchemy ORM ile veritabanı modelleri
(User, Book, Category, Review) tanımlanmış, JWT ile kimlik doğrulama sağlanmıştır. API;
kullanıcı kaydı/girişi, kitap CRUD işlemleri, arama ve yorum ekleme endpoint’lerini
sunmaktadır.

### 3.2 Frontend

React ve Vite ile geliştirilen tek sayfa uygulamasıdır (SPA). Tailwind CSS ile stillendirilmiştir.
Axios ile backend API’ye istek atar; AuthContext üzerinden JWT token yönetimi ve oturum
kontrolü yapılır. ProtectedRoute bileşeni ile yetkisiz erişim engellenir.

### 3.3 Veritabanı Yapısı

MySQL veritabanında 5 tablo bulunmaktadır: User, Book, Category, book_category (many-to-
many ara tablosu) ve Review. Kullanıcı şifreleri bcrypt ile hashlenerek saklanır.


## 4. Bulut Mimarisi ve AWS Yapılandırması

Projenin tüm bileşenleri Amazon Web Services (AWS) bulut platformu üzerinde deploy
edilmiştir. Her katman farklı bir AWS servisi üzerinde barındırılarak çift katmanlı mimari
uygulanmıştır. Aşağıda sistemin bulut üzerindeki genel mimarisi gösterilmektedir:

##### ┌─────────────────────────┐

```
│ Kullanıcı (Tarayıcı) │
└────────────┬────────────┘
│ HTTP
▼
┌─────────────────────────┐
│ AWS S3 (Frontend) │
│ React + Vite Build │
└────────────┬────────────┘
│ REST API (Axios)
▼
┌─────────────────────────┐
│ AWS EC2 (Backend) │
│ Flask + Gunicorn │
└────────────┬────────────┘
│ SQLAlchemy (Port 3306)
▼
┌─────────────────────────┐
│ AWS RDS (Veritabanı) │
│ MySQL 8.0 │
└─────────────────────────┘
```
### 4.1 AWS EC2 – Backend Sunucusu

Backend API, bir AWS EC2 instance’ı üzerinde çalıştırılmaktadır. Aşağıda instance
yapılandırma detayları yer almaktadır:

```
Parametre Değer
```
```
Instance Tipi t2.micro (Free Tier)
İşletim Sistemi Ubuntu 22.04 LTS
```
```
WSGI Sunucusu Gunicorn
Açık Portlar 22 (SSH), 5000 (API)
```
```
Region eu-north- 1 (Stockholm)
```
#### EC2 Kurulum Adımları

1. AWS Console üzerinden EC2 instance oluşturuldu (t2.micro, Ubuntu 22.04).
2. Key pair oluşturularak .pem dosyası indirildi ve SSH bağlantısı yapılandırıldı.
3. Security Group’ta inbound rule olarak 22 (SSH) ve 5000 (API) portları açıldı.
4. Sunucuya SSH ile bağlanılarak Python, pip ve sanal ortam (venv) kuruldu.
5. Proje kodu GitHub’dan clone edildi ve bağımlılıklar (requirements.txt) yüklendi.


6. .env dosyası oluşturularak veritabanı bağlantı bilgileri ve JWT secret tanımlandı.
7. Flask uygulaması Gunicorn ile başlatıldı (gunicorn -b 0.0.0.0:5000 app:app).

### 4.2 AWS RDS – Veritabanı Servisi

Veritabanı yönetimi için AWS RDS (Relational Database Service) kullanılmıştır. RDS,
veritabanı yedekleme, yama uygulama ve ölçeklendirme gibi operasyonel yükü AWS’e
devreden yönetilen bir servistir.

```
Parametre Değer
Veritabanı Motoru MySQL 8.
```
```
Instance Tipi db.t3.micro (Free Tier)
Depolama 20 GB SSD (gp2)
```
```
Multi-AZ Hayır (Free Tier)
```
```
Otomatik Yedekleme Aktif (7 gün saklama)
Public Access Hayır – yalnızca EC2 erişebilir
```
#### RDS Yapılandırma Detayları

RDS instance’ı oluşturulurken “Publicly Accessible” seçeneği kapatılmıştır. Bu sayede
veritabanına yalnızca aynı VPC içindeki EC2 instance’ı erişebilmektedir. Security Group
konfigurasyonunda inbound rule olarak MySQL portu (3306) yalnızca EC2’nin Security
Group’una açılmıştır.

EC2 üzerindeki Flask uygulaması, config.py dosyasındaki SQLALCHEMY_DATABASE_URI
ile RDS endpoint’ine bağlanmaktadır. Bağlantı formatı: mysql+pymysql://user:password@rds-
endpoint:3306/dbname

### 4.3 AWS S3 – Frontend Hosting

React uygulamasının build çıktısı AWS S3 üzerinde Static Website Hosting ile sunulmaktadır.
S3, yüksek erişilebilirlik ve düşük maliyet ile statik içerik barındırmak için ideal bir servistir.

```
Parametre Değer
```
```
Bucket Adı kitap-sitesi-frontend
```
```
Region eu-north-1 (Stockholm)
Static Hosting Aktif (index.html / error.html)
```
```
Bucket Policy Public read erişimi (s3:GetObject)
Erişim URL’i http://kitap-sitesi-frontend.s3-website.eu-north-
1.amazonaws.com
```
#### S3 Deployment Adımları

- Lokal ortamda React projesi npm run build komutu ile derlendi.
- AWS Console üzerinden S3 bucket oluşturuldu ve Static Website Hosting
    etkinleştirildi.
- Bucket Policy ile public read erişimi tanımlandı.


- Build klasöründeki (dist/) tüm dosyalar S3 bucket’ına yüklendi.
- Endpoint URL’i üzerinden sitenin erişilebilirliği doğrulandı.

### 4.4 Security Group ve Ağ Yapılandırması

AWS’te ağ güvenliği Security Group’lar üzerinden yönetilmektedir. Her servis için ayrı Security
Group tanımlanmış ve minimum yetki (least privilege) prensibi uygulanmıştır:

```
Security Group Port Protokol Kaynak / Açıklama
```
```
EC2-SG 22 TCP (SSH) Geliştirici IP’si – sunucuya uzaktan erişim
EC2-SG 5000 TCP (HTTP) 0.0.0.0/0 – API’ye dışarıdan erişim
```
```
RDS-SG 3306 TCP (MySQL) Yalnızca EC2-SG – veritabanına sadece
backend erişebilir
```
Bu yapılandırma ile veritabanı dış dünyaya kapatılmış, yalnızca EC2 üzerindeki backend
uygulamasının erişimine izin verilmiştir. Bu yaklaşım, bulut güvenliğinde önemli bir pratik olan
ağ izolasyonuna örnek teşkil etmektedir.

## 5. Güvenlik Önlemleri

Projede hem uygulama seviyesinde hem de bulut altyapı seviyesinde güvenlik önlemleri
uygulanmıştır:

### 5.1 Bulut Altyapı Güvenliği

- **Security Group’lar:** Her servis için ayrı Security Group tanımlanmış, minimum yetki
    prensibi uygulanmıştır.
- **RDS Public Access Kapalı:** Veritabanı dış ağdan erişilemez; yalnızca aynı VPC
    içindeki EC2 bağlanabilir.
- **SSH Key Pair:** EC2’ye şifre yerine SSH anahtar çifti ile bağlanılır.

### 5.2 Uygulama Güvenliği

- **JWT Token:** Stateless kimlik doğrulama ile korumalı endpoint’lere erişim kontrolü.
- **Şifre Hashleme (bcrypt):** Şifreler açık metin olarak saklanmaz, bcrypt ile hashlenir.
- **CORS Politikası:** Yalnızca yetkili origin’lerden gelen isteklere izin verilir.
- **Ortam Değişkenleri (.env):** Hassas bilgiler kaynak kodda yer almaz, .gitignore ile
    korunur.

## 6. Karşılaşılan Zorluklar ve Çözümler

- **CORS Hataları:** Frontend (S3) ve backend (EC2) farklı domainlerde olduğundan
    tarayıcı CORS hataları vermiştir. Flask-CORS kütüphanesi ile uygun Access-Control-
    Allow-Origin başlıkları tanımlanarak çözülmüştür.
- **RDS Bağlantı Sorunu:** EC2 ile RDS arasında bağlantı kurulamamıştır. Sorunun
    kaynağı RDS Security Group’unda MySQL portunun (3306) açılmamış olmasıydı.
    EC2’nin Security Group’u kaynak olarak eklenerek çözülmüştür.


- **S3 Bucket Policy:** Static Website Hosting aktif edilmesine rağmen sayfa 403
    Forbidden hatası vermiştir. Bucket Policy’de s3:GetObject izni tüm nesneler için (*)
    tanımlanarak sorun giderilmiştir.
- **Gunicorn Yapılandırması:** Flask geliştirme sunucusu production ortamı için uygun
    olmadığından Gunicorn WSGI sunucusu kullanılmıştır. 0.0.0.0 adresine bind edilerek
    dış erişime açılmıştır.

## 7. Proje Linkleri

- **GitHub:** https://github.com/ysftrv/kitap-sitesi-projesi
- **YouTube:** https://youtu.be/-Oublp-GxBY

## 8. Sonuç ve Değerlendirme

Bu projede, çift katmanlı bir web uygulaması geliştirilerek AWS bulut platformu üzerinde
başarıyla deploy edilmiştir. Proje sürecinde aşağıdaki bulut bilişim konularında uygulamalı
deneyim kazanılmıştır:

- **IaaS Kullanımı:** EC2 ile sanal sunucu oluşturma, yapılandırma ve uygulama deploy
    etme.
- **Yönetilen Servisler:** RDS ile veritabanı yönetiminin bulut servisine devredilmesi.
- **Statik Hosting:** S3 ile frontend uygulamasının maliyet etkin şekilde sunulması.
- **Ağ Güvenliği:** Security Group’lar ile servisler arası erişim kontrolü ve ağ izolasyonu.
- **Bulut Mimarisi:** Farklı AWS servislerinin entegre çalıştırılarak çok katmanlı bir
    uygulama mimarisi oluşturulması.

Sonuç olarak proje, bulut ortamında uygulama geliştirme ve yayınlama süreçlerini kavrama
açısından önemli kazanımlar sağlamıştır.


