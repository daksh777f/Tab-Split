from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, night_id: str):
        await websocket.accept()
        if night_id not in self.active_connections:
            self.active_connections[night_id] = []
        self.active_connections[night_id].append(websocket)

    def disconnect(self, websocket: WebSocket, night_id: str):
        if night_id in self.active_connections:
            if websocket in self.active_connections[night_id]:
                self.active_connections[night_id].remove(websocket)
            if not self.active_connections[night_id]:
                del self.active_connections[night_id]

    async def broadcast(self, night_id: str, message: dict):
        if night_id in self.active_connections:
            for connection in self.active_connections[night_id]:
                await connection.send_json(message)

manager = ConnectionManager()
