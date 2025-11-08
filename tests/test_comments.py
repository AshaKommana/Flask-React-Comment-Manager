import pytest

from app import create_app, db


@pytest.fixture()
def app():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_create_comment(client):
    payload = {"task_id": 1, "author": "alice", "content": "first!"}
    resp = client.post("/comments", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["id"] > 0
    assert data["task_id"] == 1
    assert data["author"] == "alice"
    assert data["content"] == "first!"
    assert "created_at" in data


def test_list_comments_and_filter(client):
    client.post("/comments", json={"task_id": 1, "author": "a1", "content": "c1"})
    client.post("/comments", json={"task_id": 2, "author": "a2", "content": "c2"})
    client.post("/comments", json={"task_id": 1, "author": "a3", "content": "c3"})

    all_resp = client.get("/comments")
    assert all_resp.status_code == 200
    all_data = all_resp.get_json()
    assert len(all_data) == 3

    filtered_resp = client.get("/comments?task_id=1")
    assert filtered_resp.status_code == 200
    filtered = filtered_resp.get_json()
    assert len(filtered) == 2
    assert all(item["task_id"] == 1 for item in filtered)


def test_get_comment_by_id(client):
    create = client.post("/comments", json={"task_id": 5, "author": "bob", "content": "hi"})
    cid = create.get_json()["id"]
    resp = client.get(f"/comments/{cid}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == cid
    assert data["task_id"] == 5


def test_update_comment(client):
    create = client.post("/comments", json={"task_id": 7, "author": "carl", "content": "old"})
    cid = create.get_json()["id"]
    upd = client.put(f"/comments/{cid}", json={"author": "carl2", "content": "new"})
    assert upd.status_code == 200
    data = upd.get_json()
    assert data["author"] == "carl2"
    assert data["content"] == "new"


def test_delete_comment(client):
    create = client.post("/comments", json={"task_id": 42, "author": "d", "content": "x"})
    cid = create.get_json()["id"]
    del_resp = client.delete(f"/comments/{cid}")
    assert del_resp.status_code == 204
    get_resp = client.get(f"/comments/{cid}")
    assert get_resp.status_code == 404


def test_validation_missing_fields(client):
    resp = client.post("/comments", json={"task_id": 1, "author": "a"})
    assert resp.status_code == 400
    resp2 = client.post("/comments", json={"task_id": 1, "content": "c"})
    assert resp2.status_code == 400
    resp3 = client.post("/comments", json={"author": "a", "content": "c"})
    assert resp3.status_code == 400








