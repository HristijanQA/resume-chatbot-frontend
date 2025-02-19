import { useState, useEffect } from "react";

function App() {
    const [resume, setResume] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/resume")
            .then(response => response.json())
            .then(data => setResume(data))
            .catch(error => console.error("Error fetching resume:", error));
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });

            const data = await response.json();
            setMessages([...messages, userMessage, { text: data.response, sender: "bot" }]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setInput("");
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Resume Chatbot</h1>
            {resume ? (
                <div>
                    <h2>{resume.name}</h2>
                    <p><strong>Title:</strong> {resume.title}</p>
                    <p><strong>Experience:</strong> {resume.experience}</p>
                </div>
            ) : (
                <p>Loading resume...</p>
            )}

            <h2>Chat with the AI</h2>
            <div style={{ border: "1px solid #ddd", padding: "10px", height: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <p key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                        <strong>{msg.sender === "user" ? "You:" : "Bot:"}</strong> {msg.text}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about the resume..."
                style={{ width: "80%", padding: "10px", marginTop: "10px" }}
            />
            <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "5px" }}>Send</button>
        </div>
    );
}

export default App;
