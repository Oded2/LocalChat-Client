"use client";

import { FormEvent, useEffect, useState, useRef } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_IP!;

export default function WebSocketComponent() {
  const [user, setUser] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesContainer = useRef<HTMLUListElement | null>(null);

  // Function to add an item to the array
  const addMessage = (item: string) => {
    setMessages((prevMessages) => [...prevMessages, item]); // Use functional update
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
    addMessage(user);
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
      addMessage(event.data);
      console.log("here");
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
              {value}
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
      <form className="join mx-auto w-full max-w-sm" onSubmit={handleSend}>
        <input
          type="text"
          onChange={handleTextChange}
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
