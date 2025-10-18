import { useState, type FormEvent } from "react"
import { useWebSocket } from "./useWebSocket"


const MessageForm = ({ user, chatId }: { 
    user: string
    chatId: string
}) => {

    const [message, setMessage] = useState("")

    const { sendMessage } = useWebSocket()

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const messageData = {
            event: "message",
            payload: {
                sender: user,
                room_id: chatId,
                message
            }
        }
        sendMessage(messageData)
    }

  return (
    <form onSubmit={handleSubmit}>
        <hr />
        <div className="input-group mt-4">
            <input 
                type="text" className="form-control"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <button className="btn btn-outline-primary">
                Send
            </button>
        </div>
    </form>
  )
}

export default MessageForm