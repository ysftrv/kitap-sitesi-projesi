"""
seed.py — Veritabanına örnek veriler ekler.
Çalıştırmak için: python seed.py
"""

import bcrypt
from app import create_app
from models import db, User, Book, Category, Review

app = create_app()

with app.app_context():
    # Tabloları temizle (sıra önemli — foreign key kısıtları)
    Review.query.delete()
    db.session.execute(db.text("DELETE FROM book_category"))
    Book.query.delete()
    Category.query.delete()
    User.query.delete()
    db.session.commit()

    print("Tablolar temizlendi.")

    # ── Kullanıcılar ──────────────────────────────────────────────
    def make_hash(pw):
        return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

    user1 = User(username="test1", email="test1@example.com", password_hash=make_hash("test123"))
    user2 = User(username="test2", email="test2@example.com", password_hash=make_hash("test123"))
    db.session.add_all([user1, user2])
    db.session.commit()
    print("Kullanıcılar eklendi.")

    # ── Kategoriler ───────────────────────────────────────────────
    kategori_isimleri = ["Roman", "Bilim Kurgu", "Tarih", "Felsefe", "Bilgisayar"]
    kategoriler = {isim: Category(name=isim) for isim in kategori_isimleri}
    db.session.add_all(kategoriler.values())
    db.session.commit()
    print("Kategoriler eklendi.")

    roman      = kategoriler["Roman"]
    bilimkurgu = kategoriler["Bilim Kurgu"]
    tarih      = kategoriler["Tarih"]
    felsefe    = kategoriler["Felsefe"]
    bilgisayar = kategoriler["Bilgisayar"]

    # ── Kitaplar ──────────────────────────────────────────────────
    kitaplar_data = [
        {
            "title": "Suç ve Ceza",
            "author": "Fyodor Dostoyevski",
            "description": "Bir öğrencinin işlediği cinayet ve bunun vicdanı üzerindeki ağır baskısını anlatan başyapıt.",
            "isbn": "9789750719387",
            "page_count": 687,
            "published_year": 1866,
            "categories": [roman, felsefe],
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "description": "Totaliter bir rejimin insanlar üzerindeki baskısını ve gözetim toplumunu konu alan distopik roman.",
            "isbn": "9789750718533",
            "page_count": 352,
            "published_year": 1949,
            "categories": [roman, bilimkurgu],
        },
        {
            "title": "Simyacı",
            "author": "Paulo Coelho",
            "description": "Kendi efsanesini aramaya çıkan genç bir çobanın yolculuğunu anlatan felsefi roman.",
            "isbn": "9789753428286",
            "page_count": 184,
            "published_year": 1988,
            "categories": [roman, felsefe],
        },
        {
            "title": "Şeker Portakalı",
            "author": "José Mauro de Vasconcelos",
            "description": "Yoksulluk içinde büyüyen küçük Zezé'nin hayal gücüyle dolu dünyasını anlatan duygu dolu roman.",
            "isbn": "9789750730504",
            "page_count": 248,
            "published_year": 1968,
            "categories": [roman],
        },
        {
            "title": "Tutunamayanlar",
            "author": "Oğuz Atay",
            "description": "Türk edebiyatının en özgün eserlerinden biri; topluma uyum sağlayamayanların tragikomik hikayesi.",
            "isbn": "9789750728419",
            "page_count": 724,
            "published_year": 1972,
            "categories": [roman, felsefe],
        },
        {
            "title": "Fareler ve İnsanlar",
            "author": "John Steinbeck",
            "description": "İki göçmen işçinin Amerikan rüyasına ulaşma çabasını ve dostluğunu anlatan kısa roman.",
            "isbn": "9789750739118",
            "page_count": 128,
            "published_year": 1937,
            "categories": [roman],
        },
        {
            "title": "Dune",
            "author": "Frank Herbert",
            "description": "Çöl gezegeni Arrakis'te geçen, siyaset, din ve ekolojinin iç içe geçtiği epik bilim kurgu serisi.",
            "isbn": "9789750263743",
            "page_count": 896,
            "published_year": 1965,
            "categories": [bilimkurgu],
        },
        {
            "title": "Python Programlama",
            "author": "Eric Matthes",
            "description": "Sıfırdan Python öğrenmek isteyenler için kapsamlı ve pratik rehber.",
            "isbn": "9780135957356",
            "page_count": 544,
            "published_year": 2019,
            "categories": [bilgisayar],
        },
    ]

    kitaplar = []
    for k in kitaplar_data:
        kitap = Book(
            title          = k["title"],
            author         = k["author"],
            description    = k["description"],
            isbn           = k["isbn"],
            page_count     = k["page_count"],
            published_year = k["published_year"],
        )
        kitap.categories = k["categories"]
        db.session.add(kitap)
        kitaplar.append(kitap)

    db.session.commit()
    print("Kitaplar eklendi.")

    # ── Yorumlar ──────────────────────────────────────────────────
    yorumlar_data = [
        (user1, kitaplar[0], 5, "Dostoyevski'nin en etkileyici eseri. Mutlaka okunmalı."),
        (user2, kitaplar[0], 4, "Psikolojik derinliği çok güçlü, biraz ağır ilerliyor ama değer."),
        (user1, kitaplar[1], 5, "Distopik kurgunun en iyi örneği. Bugün hâlâ güncel."),
        (user2, kitaplar[1], 5, "Her satırı düşündürüyor. Orwell dâhiydi."),
        (user1, kitaplar[2], 4, "Kısa ama içi dolu. Motivasyon arıyorsanız okuyun."),
        (user2, kitaplar[3], 5, "Çocukluğuma götürdü, çok duygulandım."),
        (user1, kitaplar[4], 5, "Türk edebiyatının şaheseri. Oğuz Atay'a saygılar."),
        (user2, kitaplar[6], 4, "Bilim kurgunun klasiği. Dünya inşası muhteşem."),
        (user1, kitaplar[7], 5, "Python öğrenmek için en iyi kaynaklardan biri."),
        (user2, kitaplar[5], 4, "Kısa ama çok etkileyici. Steinbeck'in ustalığı görülüyor."),
    ]

    for u, b, rating, comment in yorumlar_data:
        review = Review(user_id=u.id, book_id=b.id, rating=rating, comment=comment)
        db.session.add(review)

    db.session.commit()
    print("Yorumlar eklendi.")

    print("\nSeed tamamlandı! Veritabanı hazır.")
