from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat_endpoint():
    # Prueba que el endpoint /chat responda 200 OK
    response = client.post("/chat", json={"text": "Hola bot"})
    assert response.status_code == 200
    assert "response" in response.json()

def test_reset_chat():
    # Prueba que el reinicio funcione
    response = client.delete("/chat")
    assert response.json() == {"status": "conversación reiniciada"}
