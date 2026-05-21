import json
import uuid
from unittest.mock import AsyncMock, patch

import pytest
from starlette.testclient import TestClient

import backend.api.auth as _auth_module
from backend.main import app

_TEST_PASSWORD = "TestPass1!"

FAKE_ROADMAP_JSON = json.dumps({
    "title": "Python Fundamentals",
    "total_estimated_days": 10,
    "phases": [
        {
            "phase_number": 1,
            "title": "Basics",
            "description": "Learn Python basics",
            "topics": ["Variables", "Data Types", "Functions"],
            "estimated_days": 10,
        }
    ],
})


@pytest.fixture(scope="session", autouse=True)
def disable_secure_cookies():
    """TestClient speaks HTTP — Secure flag prevents cookie storage. Disable for tests."""
    _auth_module._COOKIE_OPTS["secure"] = False
    yield
    _auth_module._COOKIE_OPTS["secure"] = True


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def clear_client_cookies(client):
    """Clear cookie jar before each test to prevent auth leakage."""
    client.cookies.clear()
    yield


@pytest.fixture(scope="module")
def test_user(client):
    email = f"test_{uuid.uuid4().hex[:8]}@pathora-test.com"
    resp = client.post(
        "/auth/signup",
        json={"email": email, "password": _TEST_PASSWORD, "full_name": "Test User"},
    )
    assert resp.status_code == 201, f"Test user setup failed: {resp.text}"
    return {
        "email": email,
        "password": _TEST_PASSWORD,
        "cookies": dict(resp.cookies),
    }


@pytest.fixture(scope="module")
def auth_cookies(test_user):
    return test_user["cookies"]


@pytest.fixture
def mock_llm():
    with patch(
        "backend.services.roadmap_service.route_llm",
        new_callable=AsyncMock,
        return_value=(FAKE_ROADMAP_JSON, "groq-test"),
    ) as mock:
        yield mock
