from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse


STATIC_FILE_PATH = Path.cwd() / "src" / "static"


app = FastAPI()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.rooms = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    def join_room(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id].append(websocket)
        else:
            self.rooms[room_id] = [websocket]

    def leave_room(self, room_id: str, websocket: WebSocket):
        self.rooms[room_id].remove(websocket)
        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def send_message_to_room(self, room_id: str, message):
        for connection in self.rooms[room_id]:
            await connection.send_json(message)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message):
        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()


app.mount("/static", StaticFiles(directory=STATIC_FILE_PATH), name="static")


@app.get("/")
def index():
    with open("src/view/index.html") as file:
        content = file.read()
    return HTMLResponse(content)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket, client_id: str
):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            match data["event"]:
                case "join":
                    manager.join_room(data["room_id"], websocket)
                    print(f"{data["username"]} joined room {data["room_id"]}")
                case "leave":
                    manager.leave_room(data["room_id"], websocket)
                    print(f"{data["username"]} left room {data["room_id"]}")
                case "message":
                    await manager.send_message_to_room(data["room_id"], data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"event": "dissconnect"})
