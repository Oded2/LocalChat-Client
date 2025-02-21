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

  // Function to remove an item by index
  // const removeItem = (index: number) => {
  //   const newItems = messages.filter((_, i) => i !== index);
  //   setMessages(newItems);
  // };

  // Send the user data to the WebSocket server
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) socket.send(user);
    addMessage({ author: "Me", content: user });
    setUser("");
    const current = messagesContainer.current;
    if (current) {
      current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  // Handle input field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  };

  // Initialize WebSocket on component mount
  useEffect(() => {
    const ws = new WebSocket(SERVER_URL);
    setSocket(ws); // Store the WebSocket instance
    ws.onmessage = (event) => {
      const data: Data = JSON.parse(event.data);
      console.log(data);
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
  }, []); // Empty dependency array ensures this effect runs only once (on mount)

  return (
    <div className="w-full flex flex-col bg-base-200 p-4">
      <h1 className="text-xl font-bold">Server Message:</h1>
      <div className="h-96 overflow-y-auto overflow-x-hidden">
        <ul ref={messagesContainer} className="list-disc">
          {messages.map((value, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {`${value.author}: ${value.content}`}
              {/* <button
                className="btn btn-sm btn-error btn-outline"
                onClick={() => removeItem(index)}
              >
                Delete
              </button> */}
            </li>
          ))}
        </ul>
      </div>
      <div className="me-auto">
        <span>{`Your Id: ${id}`}</span>
      </div>
      <form className="join mx-auto w-full max-w-sm" onSubmit={handleSend}>
        <input
          type="text"
          onChange={handleTextChange}
          placeholder="Enter a message"
          value={user}
          className="input w-full join-item"
        />
        <button className="btn btn-primary join-item" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
