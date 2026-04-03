from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db

# Blueprint'leri içe aktar
from routes.auth    import auth_bp
from routes.books   import books_bp
from routes.reviews import reviews_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # JWT süresini config'den al
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        hours=Config.JWT_ACCESS_TOKEN_EXPIRES_HOURS
    )

    # Eklentileri başlat
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Development için tüm originler

    # Blueprint'leri kaydet
    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(books_bp,   url_prefix="/api/books")
    app.register_blueprint(reviews_bp, url_prefix="/api/books")

    # Kategoriler endpoint'i (basit, ayrı route dosyası açmaya gerek yok)
    from models import Category

    @app.route("/api/categories", methods=["GET"])
    def get_categories():
        """Tüm kategorileri listele"""
        categories = Category.query.order_by(Category.name).all()
        return jsonify({"categories": [c.to_dict() for c in categories]}), 200

    # Genel hata yakalayıcılar
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Sayfa bulunamadı"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Sunucu hatası"}), 500

    # Tabloları oluştur (yoksa)
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
