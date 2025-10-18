from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.rooms: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket

    def disconnect(self, username: str):
        del self.active_connections[username]
        for room in self.rooms.values():
            if username in room:
                del room[username]

    def join_room(self, username: str, room_id: str):
        socket = self.active_connections.get(username)
        room = self.rooms.get(room_id)

        if socket and room:
            self.rooms[room_id][username] = socket
        elif socket and not room:
            self.rooms[room_id] = {}
            self.rooms[room_id][username] = socket

    def leave_room(self, username: str, room_id: str):
        del self.rooms[room_id][username]

    async def send_message_to_room(self, room_id: str, message: dict):
        for socket in self.rooms[room_id].values():
            await socket.send_json(message)

    async def send_personal_message(self, username, message: dict):
        socket = self.active_connections.get(username)
        if socket:
            await socket.send_json(message)

    async def broadcast(self, message):
        for socket in self.active_connections.values():
            await socket.send_json(message)
