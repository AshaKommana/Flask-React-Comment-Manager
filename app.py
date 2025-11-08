from datetime import datetime

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import StaticPool


db = SQLAlchemy()


class Comment(db.Model):  # type: ignore[name-defined]
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, nullable=False, index=True)
    author = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "task_id": self.task_id,
            "author": self.author,
            "content": self.content,
            "created_at": self.created_at.isoformat() + "Z",
        }


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    # Configure in-memory SQLite with StaticPool so the same connection is reused
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "poolclass": StaticPool,
        "connect_args": {"check_same_thread": False},
    }

    db.init_app(app)
    with app.app_context():
        db.create_all()

    @app.route("/comments", methods=["POST"])
    def create_comment():
        payload = request.get_json(silent=True) or {}
        task_id = payload.get("task_id")
        author = payload.get("author")
        content = payload.get("content")

        if task_id is None or author is None or content is None:
            abort(400, description="Missing required fields: task_id, author, content")

        comment = Comment(task_id=task_id, author=author, content=content)
        db.session.add(comment)
        db.session.commit()
        return jsonify(comment.to_dict()), 201

    @app.route("/comments", methods=["GET"])
    def list_comments():
        task_id = request.args.get("task_id", type=int)
        query = Comment.query
        if task_id is not None:
            query = query.filter_by(task_id=task_id)
        comments = query.order_by(Comment.created_at.desc()).all()
        return jsonify([c.to_dict() for c in comments])

    @app.route("/comments/<int:comment_id>", methods=["GET"])
    def get_comment(comment_id: int):
        comment = Comment.query.get_or_404(comment_id)
        return jsonify(comment.to_dict())

    @app.route("/comments/<int:comment_id>", methods=["PUT", "PATCH"])
    def update_comment(comment_id: int):
        comment = Comment.query.get_or_404(comment_id)
        payload = request.get_json(silent=True) or {}

        # Only author and content are updatable
        if "author" in payload:
            author = payload.get("author")
            if author is None:
                abort(400, description="author cannot be null")
            comment.author = author
        if "content" in payload:
            content = payload.get("content")
            if content is None:
                abort(400, description="content cannot be null")
            comment.content = content

        db.session.commit()
        return jsonify(comment.to_dict())

    @app.route("/comments/<int:comment_id>", methods=["DELETE"])
    def delete_comment(comment_id: int):
        comment = Comment.query.get_or_404(comment_id)
        db.session.delete(comment)
        db.session.commit()
        return "", 204

    # Expose model for tests
    app.Comment = Comment  # type: ignore[attr-defined]

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=5000, debug=True)


