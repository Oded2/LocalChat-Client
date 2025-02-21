"use client";

import { FormEvent, useEffect, useState, useRef } from "react";

type Data = {
  content: string;
  author: string;
};

const IP = process.env.NEXT_PUBLIC_IP;

export default function WebSocketComponent() {
  if (!IP)
    return (
      <div className="flex flex-col gap-2 bg-base-100 p-5 text-center">
        <span className="text-error font-bold">Error: No IP configured</span>
        <span>
          Create a .env file if you haven&apos;t already and set
          &quot;NEXT_PUBLIC_IP&quot; as the server&apos;s IP address.
        </span>
      </div>
    );
  const SERVER_URL = `ws://${IP}:5000`;
  const [user, setUser] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      content: string;
      author: string;
    }[]
  >([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [id, setId] = useState<string>("");
  const [showIp, setShowIp] = useState<boolean>(IP === "localhost");
  const [disconnected, setDisconnected] = useState<boolean>(true);
  const messagesContainer = useRef<HTMLUListElement | null>(null);

  // Function to add an item to the array
  const addMessage = (data: Data) => {
    setMessages((prevMessages) => [...prevMessages, data]); // Use functional update
  };

  // Send the user data to the WebSocket server
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Data = {
      content: user,
      author: id,
    };
    sendToServer(data);
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

  const handlePurge = () => {
    if (!confirm("Are you sure you want to do this?")) return;
    const data: Data = {
      content: "",
      author: "request-purge",
    };
    sendToServer(data);
    setMessages([]);
  };

  const sendToServer = (data: Data) => {
    if (socket) socket.send(JSON.stringify(data));
  };

  // Initialize WebSocket on component mount
  const start = () => {
    const ws = new WebSocket(SERVER_URL);
    setSocket(ws); // Store the WebSocket instance
    ws.onmessage = (event) => {
      const data: Data = JSON.parse(event.data);
      if (data.author === "server-clientid") {
        setDisconnected(false);
        setId(data.content);
      } else {
        addMessage(data);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
      setDisconnected(true);
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
    <div className="w-full flex flex-col gap-2 justify-between bg-base-200 p-4 h-screen">
      <div className="flex mx-auto flex-col">
        <h1 className="text-xl font-bold text-center">
          {`LocalChat - ${
            showIp
              ? IP
              : IP.split(".")
                  .map((part) => part.replace(/./g, "x"))
                  .join(".")
          }`}
        </h1>
        <button className="link text-sm" onClick={() => setShowIp(!showIp)}>
          {showIp ? "Hide Server IP" : "Show Server IP"}
        </button>
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
        <div className="flex gap-2">
          {disconnected && (
            <button onClick={start} className="btn btn-primary">
              Reconnect
            </button>
          )}
          <button onClick={handlePurge} className="btn btn-error btn-outline">
            Purge Server
          </button>
        </div>
      </div>
    </div>
  );
}
