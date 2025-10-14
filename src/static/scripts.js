function buildMessage(username, content) {
    const messageList = document.getElementById("message-list")

    const outerDiv = document.createElement('div')
    const content_p = document.createElement("p")
    const username_p = document.createElement("p")

    content_p.className = "btn btn-primary disabled"
    username_p.className = "fs-sm fw-semibold"
    outerDiv.className = "d-flex gap-2 align-items-center"

    content_p.textContent = content
    username_p.textContent = username

    outerDiv.append(username_p, content_p)
    messageList.append(outerDiv)
}


function handleSubmit(e, ws) {
    e.preventDefault()

    const messageInput = document.getElementById("message-input")
    const userInput = document.getElementById("user-input")
    const data = {
        event: "message",
        room_id: "giorgi's room",
        sender: userInput.value,
        message: messageInput.value
    }
    ws.send(JSON.stringify(data))
}


function main() {
    const currentYear = document.getElementById("current-year")
    const messageForm = document.getElementById("message-form")
    const userInput = document.getElementById("user-input")

    const clientId = "chat-room"
    ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`)

    ws.onopen = function() {
        data = {
            event: "join",
            room_id: "giorgi's room",
            username: userInput.value
        }
        ws.send(JSON.stringify(data))
    }

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data)
        buildMessage(data.sender, data.message)
    }
    messageForm.addEventListener("submit", (e) => handleSubmit(e, ws))

    const date = new Date()
    currentYear.textContent = date.getFullYear()
}

document.addEventListener("DOMContentLoaded", main)
