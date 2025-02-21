"use client";

import { FormEvent, useEffect, useState, useRef } from "react";

type Data = {
  content: string;
  author: "server" | string;
};

const IP = process.env.NEXT_PUBLIC_IP!;
const SERVER_URL = `ws://${IP}:5000`;

export default function WebSocketComponent() {
  const [user, setUser] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      content: string;
      author: string;
    }[]
  >([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [id, setId] = useState<string>("");
  const messagesContainer = useRef<HTMLUListElement | null>(null);

  // Function to add an item to the array
  const addMessage = (data: Data) => {
    setMessages((prevMessages) => [...prevMessages, data]); // Use functional update
  };

  // Send the user data to the WebSocket server
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) socket.send(user);
    addMessage({ author: "Me", content: user });
    setUser("");
  };

  // Handle input field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  };

  const scroll = () => {
    const current = messagesContainer.current;
    if (current) {
      current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  // Initialize WebSocket on component mount
  const start = () => {
    const ws = new WebSocket(SERVER_URL);
    setSocket(ws); // Store the WebSocket instance
    ws.onmessage = (event) => {
      const data: Data = JSON.parse(event.data);
      if (data.author === "server") setId(data.content);
      else {
        addMessage(data);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    // Cleanup function to close WebSocket connection when the component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(); // Close connection on cleanup
      }
    };
  };

  useEffect(scroll, [messages]);

  useEffect(start, []); // Empty dependency array ensures this effect runs only once (on mount)

  return (
    <div className="w-full flex flex-col justify-between bg-base-200 p-4 h-screen">
      <div>
        <h1 className="text-xl font-bold text-center">{`LocalChat - ${IP}`}</h1>
      </div>
      <div className="overflow-y-auto overflow-x-hidden mb-auto">
        <ul ref={messagesContainer} className="list-disc">
          {messages.map((value, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {`${value.author}: ${value.content}`}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-baseline">
        <div>
          <span>{`Your Id: ${id}`}</span>
        </div>
        <form className="join mx-auto w-full max-w-lg" onSubmit={handleSend}>
          <input
            type="text"
            onChange={handleTextChange}
            placeholder="Enter a message"
            value={user}
            className="input w-full join-item"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
