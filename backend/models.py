from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Kitap-Kategori ara tablosu (many-to-many)
book_category = db.Table(
    "book_category",
    db.Column("book_id",      db.Integer, db.ForeignKey("book.id"),      primary_key=True),
    db.Column("category_id",  db.Integer, db.ForeignKey("category.id"),  primary_key=True),
)


class User(db.Model):
    """Kullanıcı modeli"""
    __tablename__ = "user"

    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80),  unique=True, nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # Kullanıcının yorumları
    reviews = db.relationship("Review", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id":         self.id,
            "username":   self.username,
            "email":      self.email,
            "created_at": self.created_at.isoformat(),
        }


class Category(db.Model):
    """Kategori modeli"""
    __tablename__ = "category"

    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Book(db.Model):
    """Kitap modeli"""
    __tablename__ = "book"

    id              = db.Column(db.Integer, primary_key=True)
    title           = db.Column(db.String(200), nullable=False)
    author          = db.Column(db.String(150), nullable=False)
    description     = db.Column(db.Text)
    isbn            = db.Column(db.String(20),  unique=True)
    cover_image_url = db.Column(db.String(500))
    page_count      = db.Column(db.Integer)
    published_year  = db.Column(db.Integer)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    # Kategorilerle ilişki (many-to-many)
    categories = db.relationship("Category", secondary=book_category, backref="books", lazy=True)
    # Kitabın yorumları
    reviews    = db.relationship("Review", backref="book", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_reviews=False):
        # Ortalama puan hesapla
        avg_rating = None
        if self.reviews:
            avg_rating = round(sum(r.rating for r in self.reviews) / len(self.reviews), 1)

        data = {
            "id":              self.id,
            "title":           self.title,
            "author":          self.author,
            "description":     self.description,
            "isbn":            self.isbn,
            "cover_image_url": self.cover_image_url,
            "page_count":      self.page_count,
            "published_year":  self.published_year,
            "created_at":      self.created_at.isoformat(),
            "categories":      [c.to_dict() for c in self.categories],
            "avg_rating":      avg_rating,
            "review_count":    len(self.reviews),
        }

        if include_reviews:
            data["reviews"] = [r.to_dict() for r in self.reviews]

        return data


class Review(db.Model):
    """Yorum modeli"""
    __tablename__ = "review"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"),  nullable=False)
    book_id    = db.Column(db.Integer, db.ForeignKey("book.id"),  nullable=False)
    rating     = db.Column(db.Integer, nullable=False)  # 1-5 arası
    comment    = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "user_id":    self.user_id,
            "book_id":    self.book_id,
            "username":   self.user.username if self.user else None,
            "rating":     self.rating,
            "comment":    self.comment,
            "created_at": self.created_at.isoformat(),
        }
