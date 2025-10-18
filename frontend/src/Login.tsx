import { useState, type FormEvent } from "react"
import { useWebSocket } from "./useWebSocket"


const Login = () => {
    const [username, setUsername] = useState("giorgi")
    const { setUser } = useWebSocket()


    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!username) return
        setUser(username)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label className="form-label" htmlFor="username">
                    Username:
                </label>
                <input 
                    id="username"
                    className="form-control"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-primary btn-lg">
                    Login
                </button>
            </div>
        </form>
    )
}

export default Login