from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Review, Book

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/<int:book_id>/reviews", methods=["GET"])
def get_reviews(book_id):
    """Bir kitabın yorumlarını getir"""
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Kitap bulunamadı"}), 404

    reviews = Review.query.filter_by(book_id=book_id).order_by(Review.created_at.desc()).all()

    return jsonify({"reviews": [r.to_dict() for r in reviews]}), 200


@reviews_bp.route("/<int:book_id>/reviews", methods=["POST"])
@jwt_required()
def add_review(book_id):
    """Kitaba yorum ekle (giriş gerekli)"""
    book = Book.query.get(book_id)

    if not book:
        return jsonify({"error": "Kitap bulunamadı"}), 404

    data = request.get_json()

    if not data or "rating" not in data:
        return jsonify({"error": "rating zorunludur"}), 400

    rating = data["rating"]

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"error": "rating 1 ile 5 arasında olmalıdır"}), 400

    user_id = int(get_jwt_identity())

    # Kullanıcı bu kitaba daha önce yorum yapmış mı?
    existing = Review.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing:
        return jsonify({"error": "Bu kitaba zaten yorum yaptınız"}), 400

    review = Review(
        user_id = user_id,
        book_id = book_id,
        rating  = rating,
        comment = data.get("comment", "").strip(),
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({"message": "Yorum eklendi", "review": review.to_dict()}), 201
