from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from src.manager import ConnectionManager


app = FastAPI()

manager = ConnectionManager()


@app.websocket("/ws/{username}")
async def websocket_endpoint(
    websocket: WebSocket, username: str
):
    await manager.connect(username, websocket)
    join_message = {
        "event": "get_users",
        "payload": {"users": list(manager.active_connections.keys())}
    }
    await manager.broadcast(join_message)
    try:
        while True:
            message = await websocket.receive_json()
            print(message)
            event: str = message.get("event")
            payload: dict = message.get("payload")
            room_id = payload.get("room_id")

            if room_id:
                match event:
                    case "join":
                        manager.join_room(username, room_id)
                        print(f"{username} joined room {room_id}")
                    case "leave":
                        manager.leave_room(username, room_id)
                        print(f"{username} left room {room_id}")
                    case "message":
                        await manager.send_message_to_room(room_id, message)
                        print(f"Message recieved: {payload}")

    except WebSocketDisconnect:
        manager.disconnect(username)
        print(f"{username} disconnected")
