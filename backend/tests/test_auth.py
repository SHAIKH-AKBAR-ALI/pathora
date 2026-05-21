import uuid

_TEST_PASSWORD = "TestPass1!"


def _email():
    return f"auth_{uuid.uuid4().hex[:8]}@pathora-test.com"


def test_signup_valid(client):
    resp = client.post("/auth/signup", json={
        "email": _email(),
        "password": _TEST_PASSWORD,
        "full_name": "Valid User",
    })
    assert resp.status_code == 201
    body = resp.json()
    assert body["success"] is True
    assert body["data"]["email"] is not None


def test_signup_duplicate(client):
    email = _email()
    payload = {"email": email, "password": _TEST_PASSWORD, "full_name": "Dup"}
    r1 = client.post("/auth/signup", json=payload)
    assert r1.status_code == 201
    r2 = client.post("/auth/signup", json=payload)
    assert r2.status_code == 409
    assert r2.json()["success"] is False


def test_signup_weak_password(client):
    resp = client.post("/auth/signup", json={
        "email": _email(),
        "password": "weakpassword",
        "full_name": "Weak",
    })
    assert resp.status_code == 422
    assert resp.json()["success"] is False


def test_login_valid(client, test_user):
    resp = client.post("/auth/login", json={
        "email": test_user["email"],
        "password": test_user["password"],
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "access_token" in resp.cookies


def test_login_wrong_password(client, test_user):
    resp = client.post("/auth/login", json={
        "email": test_user["email"],
        "password": "WrongPass1!",
    })
    assert resp.status_code == 401
    assert resp.json()["success"] is False


def test_me_unauthenticated(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 401


def test_me_authenticated(client, auth_cookies):
    resp = client.get("/auth/me", cookies=auth_cookies)
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "email" in body["data"]
