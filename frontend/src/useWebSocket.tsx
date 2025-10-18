import { useEffect, useState, useRef, useContext, createContext, type ReactNode } from 'react'


const WebSocketContext = createContext({})


export function WebSocketContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState("")
    const [message, setMessage] = useState(null)
    const ws = useRef<null | WebSocket>(null)

    const SOCKET_URL = "ws://localhost:8000/ws/" + user

    useEffect(() => {
        ws.current = new WebSocket(SOCKET_URL)

        ws.current.onmessage = (event) => {
            setMessage(event.data)
        }

        ws.current.onclose = () => {
            console.log('WebSocket disconnected')
        }

        return () => {
            if (ws?.current) ws.current.close()
        }

    }, [user])

    const sendMessage = (data: Record<string, any>) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data))
        }
    }

    return (
        <WebSocketContext.Provider value={{
            message, sendMessage, user, setUser
        }}>
            { children }
        </WebSocketContext.Provider>
    )
}


export const useWebSocket = () => useContext(WebSocketContext)