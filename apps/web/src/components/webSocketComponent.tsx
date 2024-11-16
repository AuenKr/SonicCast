"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type WebSocketComponentProps = {
  url: string; // WebSocket server URL
};

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ url }) => {
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket instance
  const [messages, setMessages] = useState<string[]>([]); // Received messages
  const [input, setInput] = useState<string>(""); // Message input state

  useEffect(() => {
    // Create a WebSocket connection
    const socket = new WebSocket(`${url}`);

    socket.onopen = () => {
      console.log(`Connected to WebSocket server at ${url}`);
    };

    socket.onmessage = (event) => {
      console.log(`Message received: ${event.data}`);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(input);
      setInput(""); // Clear the input field
    } else {
      console.error("WebSocket is not open");
    }
  };

  return (
    <div>
      <h1>WebSocket Room: {url}</h1>
      <div>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
