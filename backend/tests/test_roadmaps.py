import uuid

import pytest

_TEST_PASSWORD = "TestPass1!"
_ROADMAP_PAYLOAD = {
    "topic": "Python",
    "difficulty": "beginner",
    "goal": "Learn Python basics",
}


@pytest.fixture(autouse=True)
def unlimited_usage(monkeypatch):
    """Bypass free-tier limits so tests don't accumulate against the real DB counters."""
    monkeypatch.setattr("backend.services.roadmap_service._FREE_ROADMAP_LIMIT", 100)
    monkeypatch.setattr("backend.services.roadmap_service._FREE_EXPLANATION_LIMIT", 100)


def test_generate_roadmap_unauthenticated(client):
    resp = client.post("/roadmaps", json=_ROADMAP_PAYLOAD)
    assert resp.status_code == 401


def test_generate_roadmap_authenticated(client, auth_cookies, mock_llm):
    resp = client.post("/roadmaps", json=_ROADMAP_PAYLOAD, cookies=auth_cookies)
    assert resp.status_code == 201
    body = resp.json()
    assert body["success"] is True
    assert body["data"]["topic"] == "Python"
    assert len(body["data"]["content"]["phases"]) > 0


def test_get_roadmap_by_id(client, auth_cookies, mock_llm):
    create = client.post("/roadmaps", json=_ROADMAP_PAYLOAD, cookies=auth_cookies)
    assert create.status_code == 201
    roadmap_id = create.json()["data"]["id"]

    resp = client.get(f"/roadmaps/{roadmap_id}", cookies=auth_cookies)
    assert resp.status_code == 200
    assert resp.json()["data"]["id"] == roadmap_id


def test_get_roadmap_wrong_user(client, auth_cookies, mock_llm):
    create = client.post("/roadmaps", json=_ROADMAP_PAYLOAD, cookies=auth_cookies)
    assert create.status_code == 201
    roadmap_id = create.json()["data"]["id"]

    email2 = f"other_{uuid.uuid4().hex[:8]}@nexpath-test.com"
    signup2 = client.post("/auth/signup", json={
        "email": email2,
        "password": _TEST_PASSWORD,
        "full_name": "Other User",
    })
    assert signup2.status_code == 201
    cookies2 = dict(signup2.cookies)

    resp = client.get(f"/roadmaps/{roadmap_id}", cookies=cookies2)
    assert resp.status_code == 404


def test_explain_topic(client, auth_cookies, mock_llm):
    create = client.post("/roadmaps", json=_ROADMAP_PAYLOAD, cookies=auth_cookies)
    assert create.status_code == 201
    roadmap_id = create.json()["data"]["id"]

    resp = client.post(
        f"/roadmaps/{roadmap_id}/explain",
        json={"topic": "Variables"},
        cookies=auth_cookies,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "explanation" in body["data"]


def test_why_topic(client, auth_cookies, mock_llm):
    create = client.post("/roadmaps", json=_ROADMAP_PAYLOAD, cookies=auth_cookies)
    assert create.status_code == 201
    roadmap_id = create.json()["data"]["id"]

    resp = client.post(
        f"/roadmaps/{roadmap_id}/why",
        json={"topic": "Variables"},
        cookies=auth_cookies,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "answer" in body["data"]
