import { useEffect, useState, type FormEvent } from "react"
import { useWebSocket } from "./useWebSocket"
import MessageList, { type Message } from "./MessageList"
import MessageForm from "./MessageForm"

type ChatRoomPropsType = {
    user: string
    setUser: React.Dispatch<React.SetStateAction<string>>
}

const ChatRoom = ({ user, setUser }: ChatRoomPropsType) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [chatId, setChatId] = useState("")
    const [roomOpen, setRoomOpen] = useState(false)
    if (!user) return null
    
    const { message, sendMessage } = useWebSocket()

    const data = JSON.parse(String(message))

    useEffect(() => {
        if (data?.event === "message" && data?.payload) {
            setMessages(prev => [...prev, data.payload])
        }
    }, [message])

    console.log(message)

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!chatId) return
        const msg = { event: "join", payload: { room_id: chatId }}
        sendMessage(msg)
        setRoomOpen(true)
    }

    return (
        <section>
            <p>User Joined: {user}</p>
            <div className="d-flex justify-content-between  gap-3">
                <form onSubmit={handleSubmit} className="flex-grow-1">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter chat ID here"
                            className="form-control"
                            value={chatId}
                            onChange={e => setChatId(e.target.value)}
                        />
                        <button className="btn btn-secondary">
                            Join Chat Room
                        </button>
                    </div>
                </form>
                <div>
                    <button onClick={() => setUser("")} className="btn btn-danger">
                        Log out
                    </button>
                </div>
            </div>
            { roomOpen &&
                <>
                    <MessageList messages={messages} />
                    <MessageForm chatId={chatId} user={user} />
                </>
            }
            
        </section>
    )
}

export default ChatRoom