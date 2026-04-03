from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

from models import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Yeni kullanıcı kaydı"""
    data = request.get_json()

    # Zorunlu alanları kontrol et
    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "username, email ve password zorunludur"}), 400

    username = data["username"].strip()
    email    = data["email"].strip().lower()
    password = data["password"]

    if len(password) < 6:
        return jsonify({"error": "Şifre en az 6 karakter olmalıdır"}), 400

    # Kullanıcı zaten var mı?
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Bu email zaten kayıtlı"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Bu kullanıcı adı zaten alınmış"}), 400

    # Şifreyi hashle
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user = User(username=username, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Kayıt başarılı", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Kullanıcı girişi, JWT token döndür"""
    data = request.get_json()

    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "email ve password zorunludur"}), 400

    email    = data["email"].strip().lower()
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Email veya şifre hatalı"}), 401

    # 1 günlük token oluştur
    token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1))

    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Token ile oturum açmış kullanıcının bilgilerini döndür"""
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))

    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 404

    return jsonify({"user": user.to_dict()}), 200
