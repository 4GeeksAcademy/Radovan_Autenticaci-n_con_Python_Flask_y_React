"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import  request, jsonify, Blueprint, make_response, current_app
from api.models import db, User
from flask_cors import CORS
import json
from datetime import timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
# from datetime import datetime
from flask_bcrypt import Bcrypt



api = Blueprint('api', __name__)
bcrypt = Bcrypt()
jwt = JWTManager

CORS(api)

@api.route('/sign', methods=['POST'])
def create_one_user():
    try:

        body = request.get_json()
        print(body)
        required_fields = ["fullName", "email", "password", "userName"]
        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({"error": f"El campo '{field}' es requerido y no puede estar vacío"}), 400

        raw_password = body.get('password')
        password_hash = bcrypt.generate_password_hash(raw_password).decode('utf-8')

        new_user = User(
            full_name=body.get("fullName"),
            email=body.get("email"),
            password=password_hash,
            user_name=body.get("userName"),

        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "user created successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error al crear usuario: {str(e)}")

        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@api.route("/login", methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or 'email' not in data or 'password' not in data:
            return jsonify ({"error": "se requieren tanto el correo como la contraseña."}),
            400

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "usuario no encontrado"}), 400

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "contraseña incorrecta"}), 401

        access_token = create_access_token(identity=str(user.id))

        return jsonify({"access_token": access_token, "user": user.serialize()}), 200

    except Exception as e:
        print(f"error en la ruta /login: {str(e)}" )
        return jsonify({"error": f"ocurrio un error al procesar la solicitud: {str(e)}"}), 500

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    try: 
        user_id=get_jwt_identity()
        print(user_id)
    # user = User.query.get(user_id)
    # print(user_id)
    # if user is None:
    #     return False ,404
    # return jsonify(user.serialize()), 200
        return jsonify("hola")
    except:
        return jsonify("error")
    

@api.route('/user/<int:user_id>', methods=['GET'])
def get_one_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": f"user with id {user_id} not found"}), 404
    serialized_user = user.serialize()
    return serialized_user, 200

