

export interface Message {
    message: string
    sender: string
}


const MessageList = ({ messages }: { messages: Message[] }) => {


    const msgItems = messages.map(msg => (
        <div className="d-flex gap-1 align-items-center" key={msg.message}>
            <p>{msg.sender}</p>
            <p className="py-2 px-3 rounded-4 bg-primary text-white">
                {msg.message}
            </p>
        </div>
    ))

  return (
    <section className="min-vh-60">
        <hr />
        {msgItems}
    </section>
  )
}

export default MessageList