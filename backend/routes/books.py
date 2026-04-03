from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Book, Category

books_bp = Blueprint("books", __name__)


@books_bp.route("", methods=["GET"])
def get_books():
    """
    Kitapları listele.
    Opsiyonel sorgu parametreleri:
      - page, per_page  → sayfalama
      - category        → kategori id'sine göre filtrele
    """
    page     = request.args.get("page",     1,  type=int)
    per_page = request.args.get("per_page", 10, type=int)
    cat_id   = request.args.get("category",     type=int)

    query = Book.query

    if cat_id:
        query = query.filter(Book.categories.any(id=cat_id))

    paginated = query.order_by(Book.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "books":       [b.to_dict() for b in paginated.items],
        "total":       paginated.total,
        "pages":       paginated.pages,
        "current_page": page,
    }), 200


@books_bp.route("/search", methods=["GET"])
def search_books():
    """Kitap adı veya yazar adında arama yap"""
    q = request.args.get("q", "").strip()

    if not q:
        return jsonify({"error": "Arama kelimesi gerekli"}), 400

    books = Book.query.filter(
        db.or_(
            Book.title.ilike(f"%{q}%"),
            Book.author.ilike(f"%{q}%"),
        )
    ).all()

    return jsonify({"books": [b.to_dict() for b in books]}), 200


@books_bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    """Tek kitap detayını yorumlarıyla birlikte getir"""
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Kitap bulunamadı"}), 404

    return jsonify({"book": book.to_dict(include_reviews=True)}), 200


@books_bp.route("", methods=["POST"])
@jwt_required()
def create_book():
    """Yeni kitap ekle (giriş gerekli)"""
    data = request.get_json()

    if not data or not all(k in data for k in ("title", "author")):
        return jsonify({"error": "title ve author zorunludur"}), 400

    # ISBN tekrarını kontrol et
    isbn = data.get("isbn")
    if isbn and Book.query.filter_by(isbn=isbn).first():
        return jsonify({"error": "Bu ISBN zaten kayıtlı"}), 400

    book = Book(
        title           = data["title"].strip(),
        author          = data["author"].strip(),
        description     = data.get("description"),
        isbn            = isbn,
        cover_image_url = data.get("cover_image_url"),
        page_count      = data.get("page_count"),
        published_year  = data.get("published_year"),
    )

    # Kategorileri ata
    category_ids = data.get("category_ids", [])
    if category_ids:
        categories = Category.query.filter(Category.id.in_(category_ids)).all()
        book.categories = categories

    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Kitap eklendi", "book": book.to_dict()}), 201


@books_bp.route("/<int:book_id>", methods=["PUT"])
@jwt_required()
def update_book(book_id):
    """Kitap bilgilerini güncelle (giriş gerekli)"""
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Kitap bulunamadı"}), 404

    data = request.get_json() or {}

    # Gelen alanları güncelle
    for field in ("title", "author", "description", "isbn", "cover_image_url", "page_count", "published_year"):
        if field in data:
            setattr(book, field, data[field])

    if "category_ids" in data:
        categories = Category.query.filter(Category.id.in_(data["category_ids"])).all()
        book.categories = categories

    db.session.commit()

    return jsonify({"message": "Kitap güncellendi", "book": book.to_dict()}), 200


@books_bp.route("/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    """Kitabı sil (giriş gerekli)"""
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Kitap bulunamadı"}), 404

    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Kitap silindi"}), 200
