import { useState } from "react"
import ChatRoom from "./ChatRoom"
import Login from "./Login"
import { useWebSocket } from "./useWebSocket"


const App = () => {
  const { user, setUser } = useWebSocket()

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5 p-4 rounded-2 bg-light border border-secondary">
          { user ? 
            <ChatRoom user={user} setUser={setUser} /> :
            <Login />}
        </div>
      </div>
    </main>
  )
}

export default App