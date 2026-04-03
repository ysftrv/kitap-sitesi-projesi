# AWS Deploy Kılavuzu — Kitap Sitesi

Bu kılavuz projeyi AWS üzerinde yayına almak için gereken adımları açıklar.

---

## 1. AWS RDS ile MySQL Veritabanı Oluşturma

### 1.1 RDS Instance Oluşturma

1. AWS Console'a giriş yap → **RDS** servisine git.
2. **Create database** butonuna tıkla.
3. Aşağıdaki ayarları seç:

| Ayar | Değer |
|------|-------|
| Engine | MySQL |
| Version | MySQL 8.0 |
| Template | **Free tier** |
| DB instance identifier | `booksite-db` |
| Master username | `admin` |
| Master password | Güçlü bir şifre belirle |
| Instance class | `db.t3.micro` |
| Storage | 20 GB (gp2) |
| Public access | **Yes** (geçici, sonra kapatılabilir) |

4. **Create database** ile oluştur. Yaklaşık 5–10 dakika sürer.

### 1.2 Security Group Ayarları

RDS instance'ına MySQL bağlantısına izin vermek için:

1. RDS → Databases → `booksite-db` → **Connectivity & security** sekmesi.
2. **VPC security groups** altındaki gruba tıkla.
3. **Inbound rules** → **Edit inbound rules**:
   - Type: `MySQL/Aurora`
   - Port: `3306`
   - Source: EC2 instance'ının security group'u (veya geçici olarak `My IP`)
4. **Save rules**.

### 1.3 Veritabanı Oluşturma

RDS endpoint'i hazır olduktan sonra yerel makinenden bağlan ve veritabanını oluştur:

```bash
mysql -h <RDS_ENDPOINT> -u admin -p
```

```sql
CREATE DATABASE booksite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 2. AWS EC2 ile Backend Deploy

### 2.1 EC2 Instance Oluşturma

1. AWS Console → **EC2** → **Launch instance**.
2. Ayarlar:

| Ayar | Değer |
|------|-------|
| Name | `booksite-backend` |
| AMI | Ubuntu Server 22.04 LTS |
| Instance type | `t2.micro` (free tier) |
| Key pair | Yeni oluştur, `.pem` dosyasını indir |
| Security group | HTTP (80), HTTPS (443), SSH (22) aç |

3. **Launch instance**.

### 2.2 EC2'ye Bağlanma

```bash
# .pem dosyasının iznini ayarla
chmod 400 anahtar.pem

# SSH ile bağlan
ssh -i anahtar.pem ubuntu@<EC2_PUBLIC_IP>
```

### 2.3 Ubuntu Sunucu Kurulumu

```bash
# Sistem paketlerini güncelle
sudo apt update && sudo apt upgrade -y

# Python ve pip kur
sudo apt install python3 python3-pip python3-venv git -y

# MySQL client kur (bağlantı testi için)
sudo apt install mysql-client -y
```

### 2.4 Proje Dosyalarını Yükle

```bash
# Projeyi sunucuya kopyala (yerel makinenden çalıştır)
scp -i anahtar.pem -r ./backend ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/kitap-projesi/

# Veya git ile klonla
git clone https://github.com/kullanici/kitap-projesi.git
```

### 2.5 Python Bağımlılıklarını Kur

```bash
cd /home/ubuntu/kitap-projesi/backend

# Sanal ortam oluştur
python3 -m venv venv
source venv/bin/activate

# Bağımlılıkları kur
pip install -r requirements.txt
```

### 2.6 .env Dosyasını Ayarla

```bash
nano .env
```

Aşağıdaki içeriği gir (RDS bilgileriyle güncelle):

```
MYSQL_HOST=<RDS_ENDPOINT>
MYSQL_USER=admin
MYSQL_PASSWORD=<RDS_SIFRENI>
MYSQL_DB=booksite_db
JWT_SECRET_KEY=production-icin-guclu-bir-anahtar
```

### 2.7 Veritabanı Tablolarını ve Seed Verilerini Oluştur

```bash
source venv/bin/activate
python app.py &    # Tabloları oluşturmak için bir kez çalıştır, sonra durdur (Ctrl+C)
python seed.py     # Örnek verileri ekle
```

### 2.8 Gunicorn ile Flask Çalıştırma

```bash
# Gunicorn ile başlat
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

#### Systemd Servisi Olarak Ayarla (Sunucu yeniden başlayınca otomatik çalışsın)

```bash
sudo nano /etc/systemd/system/kitap-backend.service
```

Dosya içeriği:

```ini
[Unit]
Description=Kitap Sitesi Flask Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/kitap-projesi/backend
Environment="PATH=/home/ubuntu/kitap-projesi/backend/venv/bin"
ExecStart=/home/ubuntu/kitap-projesi/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Servisi etkinleştir ve başlat
sudo systemctl daemon-reload
sudo systemctl enable kitap-backend
sudo systemctl start kitap-backend

# Durumu kontrol et
sudo systemctl status kitap-backend
```

### 2.9 EC2 Security Group'a Port 5000 Ekle

1. EC2 → Instance → **Security** sekmesi → Security group'a tıkla.
2. **Inbound rules** → **Edit**:
   - Type: Custom TCP
   - Port: `5000`
   - Source: `0.0.0.0/0`

---

## 3. AWS S3 ile Frontend Deploy

### 3.1 React Build Alma

Yerel makinende frontend klasöründe:

```bash
cd frontend

# api.js içinde baseURL'i EC2 adresinle güncelle
# baseURL: "http://<EC2_PUBLIC_IP>:5000/api"

npm install
npm run build
# dist/ klasörü oluşur
```

### 3.2 S3 Bucket Oluşturma

1. AWS Console → **S3** → **Create bucket**.
2. Ayarlar:

| Ayar | Değer |
|------|-------|
| Bucket name | `kitap-sitesi-frontend` (benzersiz olmalı) |
| Region | Seçtiğin bölge |
| Block all public access | **Kaldır** (public erişim gerekli) |

3. **Create bucket**.

### 3.3 Static Website Hosting Açma

1. Bucket → **Properties** sekmesi.
2. **Static website hosting** → **Edit**.
3. Ayarlar:
   - Enable: **Enabled**
   - Index document: `index.html`
   - Error document: `index.html`
4. **Save changes**.

### 3.4 Bucket Policy Ayarla

Bucket → **Permissions** → **Bucket policy** → **Edit**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kitap-sitesi-frontend/*"
    }
  ]
}
```

### 3.5 Build Dosyalarını S3'e Yükle

```bash
# AWS CLI kurulu değilse kur
pip install awscli

# AWS kimlik bilgilerini yapılandır
aws configure
# Access Key ID, Secret Access Key, Region gir

# dist klasörünü yükle
aws s3 sync ./dist s3://kitap-sitesi-frontend --delete
```

### 3.6 Siteye Erişim

Bucket → **Properties** → **Static website hosting** altında endpoint URL'i görürsün:

```
http://kitap-sitesi-frontend.s3-website-<region>.amazonaws.com
```

---

## 4. Güvenlik Notları

### .env Dosyasını Git'e Yükleme

```bash
# .gitignore dosyasına ekle
echo ".env" >> .gitignore
```

`.env` dosyası asla commit edilmemeli. Üretim ortamında değişkenleri EC2'de doğrudan ayarla veya AWS Secrets Manager kullan.

### HTTPS Kullanma

Production ortamında HTTP yerine HTTPS kullanılmalı:

- **Backend için:** EC2 önüne bir **Application Load Balancer** + **ACM sertifikası** ekle, veya **Nginx** + **Certbot (Let's Encrypt)** kullan:

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Alan adın varsa sertifika al
sudo certbot --nginx -d yourdomain.com
```

- **Frontend için:** S3 önüne **CloudFront** dağıtımı ekle, ACM ile ücretsiz SSL sertifikası kullan.

### Production'da CORS Kısıtlama

`app.py` içindeki CORS ayarını production'da yalnızca frontend adresine izin verecek şekilde güncelle:

```python
# Development (şu anki hali — herkese açık)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Production (sadece kendi frontend adresin)
CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
```

### Ek Güvenlik Önerileri

- RDS'e **public access** verme; yalnızca EC2'nin security group'undan erişime izin ver.
- EC2 SSH portunu (22) yalnızca kendi IP adresine aç.
- `JWT_SECRET_KEY` değerini uzun ve rastgele bir string yap (en az 32 karakter).
- Üretimde Flask'ı `debug=False` ile çalıştır (Gunicorn bunu zaten yapar).
